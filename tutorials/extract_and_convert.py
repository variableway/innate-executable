"""Extract Python code from notebooks into a package and convert explanations into Markdown.

Run from the project root:

    python extract_and_convert.py

What it does
------------
1. Walks the source folders (basics/, 100-programs/, advanced/pydantic/,
   audio_processing_in_Python/, image-processing/, "Exploratory Data Analysis
   using Python"/, quizzes/, plus the project root for the
   brain-tumor-classification notebook).
2. For every ``.ipynb``:
   - Writes a ``.py`` module under ``be_theboss/...`` containing the code cells,
     prefixed with a docstring and cell-by-cell comments.
   - Writes a ``.md`` file under ``docs/...`` containing the markdown cells and
     the code cells wrapped in ```` ```python ```` fenced code blocks (plus any
     captured outputs in plain fenced blocks).
3. Copies every existing ``.py`` file into the matching package module and
   every existing ``.md`` file into ``docs/``.
4. Generates a top-level ``docs/README.md`` index linking to every produced
   document.
"""
from __future__ import annotations

import json
import re
import shutil
from dataclasses import dataclass
from pathlib import Path
from typing import Iterable

# ---------------------------------------------------------------------------
# Layout
# ---------------------------------------------------------------------------

ROOT = Path(__file__).resolve().parent
PACKAGE_ROOT = ROOT / "be_theboss"
DOCS_ROOT = ROOT / "docs"

# (source_dir, package_subpath, docs_subpath, label)
# - source_dir is relative to ROOT
# - package_subpath and docs_subpath are relative to PACKAGE_ROOT and DOCS_ROOT
SOURCES: list[tuple[str, str, str, str]] = [
    ("basics",                              "basics",                "basics",                "Python Basics 101"),
    ("100-programs",                        "hundred_programs",      "hundred_programs",      "The 100 Programs"),
    ("advanced/pydantic",                   "advanced/pydantic",     "advanced/pydantic",     "Advanced / Pydantic"),
    ("audio_processing_in_Python",          "audio",                 "audio",                 "Audio Processing in Python"),
    ("image-processing",                    "image",                 "image",                 "Image Processing in Python"),
    ("Exploratory Data Analysis using Python", "eda",                "eda",                   "Exploratory Data Analysis using Python"),
    ("quizzes",                             "quizzes",               "quizzes",               "Quizzes"),
    ("intuitive-ml",                        "intuitive_ml",          "intuitive_ml",          "Intuitive ML"),
]

# The brain-tumor notebook lives at the repo root.
ROOT_NOTEBOOKS: list[tuple[str, str, str]] = [
    # (notebook_filename, package_subpath, docs_subpath)
    ("brain-tumor-classification.ipynb", "brain_tumor", "brain_tumor"),
]


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

_NUM_PREFIX = re.compile(r"^\d+[_\- ]?")

# Directories we never want to descend into when scanning for notebooks.
_SKIP_DIRS = {
    ".git", ".github", ".ipynb_checkpoints", "__pycache__",
    "assets", "svgs", "node_modules", ".venv", "venv",
}


def slugify(name: str) -> str:
    """Turn ``'100_progress_bar'`` into ``'progress_bar'``-friendly tokens."""
    s = _NUM_PREFIX.sub("", name).strip().lower()
    s = re.sub(r"[\s\-]+", "_", s)
    s = re.sub(r"[^a-z0-9_]+", "", s)
    s = re.sub(r"_+", "_", s).strip("_")
    return s or "module"


def slugify_part(name: str) -> str:
    """Slugify a single path part, preserving its leading number (e.g. ``'Linear Regression'`` -> ``'linear_regression'``)."""
    s = name.strip().lower()
    s = re.sub(r"[\s\-]+", "_", s)
    s = re.sub(r"[^a-z0-9_]+", "", s)
    s = re.sub(r"_+", "_", s).strip("_")
    return s or "section"


def humanize(stem: str) -> str:
    """Turn a filename stem into a human-readable title."""
    cleaned = _NUM_PREFIX.sub("", stem).replace("_", " ").replace("-", " ").strip()
    return cleaned[:1].upper() + cleaned[1:] if cleaned else stem


def join_source(cell_source) -> str:
    if isinstance(cell_source, list):
        return "".join(cell_source)
    return cell_source or ""


def get_output_text(outputs) -> list[str]:
    """Render a notebook code cell's outputs as a list of plain-text lines."""
    lines: list[str] = []
    for out in outputs or []:
        otype = out.get("output_type")
        if otype == "stream":
            lines.append(join_source(out.get("text", "")))
        elif otype in ("execute_result", "display_data"):
            data = out.get("data", {}) or {}
            if "text/plain" in data:
                lines.append(join_source(data["text/plain"]))
        elif otype == "error":
            lines.append("Traceback (most recent call last):")
            for tb in out.get("traceback", []):
                lines.append(join_source(tb))
    return lines


def read_notebook(path: Path) -> dict:
    with path.open("r", encoding="utf-8") as fh:
        return json.load(fh)


# ---------------------------------------------------------------------------
# Per-notebook conversion
# ---------------------------------------------------------------------------

@dataclass
class Converted:
    py_path: Path
    md_path: Path
    title: str


def convert_notebook(
    nb_path: Path,
    pkg_dir: Path,
    docs_dir: Path,
    source_label: str,
) -> Converted:
    """Extract a notebook into a package module and a docs markdown file."""
    nb = read_notebook(nb_path)
    cells = nb.get("cells", [])

    title = humanize(nb_path.stem)
    module_name = slugify(nb_path.stem)

    pkg_dir.mkdir(parents=True, exist_ok=True)
    docs_dir.mkdir(parents=True, exist_ok=True)

    py_path = pkg_dir / f"{module_name}.py"
    md_path = docs_dir / f"{module_name}.md"

    py_lines: list[str] = [
        f'"""{title} - extracted from {source_label}/{nb_path.name}."""',
        "",
        "from __future__ import annotations",
        "",
    ]
    md_lines: list[str] = [
        f"# {title}",
        "",
        f"_Source notebook: `{source_label}/{nb_path.name}`._",
        "",
    ]

    for idx, cell in enumerate(cells):
        ctype = cell.get("cell_type")
        source = join_source(cell.get("source", []))
        if not source.strip():
            continue
        if ctype == "markdown":
            md_lines.extend(source.rstrip("\n").splitlines())
            md_lines.append("")
        elif ctype == "code":
            py_lines.append(f"# --- cell {idx} ---")
            py_lines.append(source.rstrip("\n"))
            py_lines.append("")

            md_lines.append("```python")
            md_lines.extend(source.rstrip("\n").splitlines())
            md_lines.append("```")
            outputs = get_output_text(cell.get("outputs", []))
            if outputs:
                md_lines.append("")
                md_lines.append("Output:")
                md_lines.append("")
                md_lines.append("```")
                for line in outputs:
                    md_lines.append(line.rstrip("\n"))
                md_lines.append("```")
            md_lines.append("")

    py_path.write_text("\n".join(py_lines).rstrip() + "\n", encoding="utf-8")
    md_path.write_text("\n".join(md_lines).rstrip() + "\n", encoding="utf-8")
    return Converted(py_path=py_path, md_path=md_path, title=title)


# ---------------------------------------------------------------------------
# Pipeline
# ---------------------------------------------------------------------------

def reset_dir(path: Path) -> None:
    """Wipe ``path`` (if it exists) so each run produces a clean output."""
    if path.exists():
        shutil.rmtree(path)
    path.mkdir(parents=True, exist_ok=True)


def write_init(path: Path, doc: str) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(f'"""{doc}"""\n', encoding="utf-8")


def collect_notebook_files(source_dir: Path, recurse: bool = False) -> list[Path]:
    if not recurse:
        return sorted(p for p in source_dir.glob("*.ipynb") if p.is_file())
    matches: list[Path] = []
    for p in source_dir.rglob("*.ipynb"):
        if not p.is_file():
            continue
        if any(part in _SKIP_DIRS for part in p.relative_to(source_dir).parts):
            continue
        matches.append(p)
    return sorted(matches)


def collect_python_files(source_dir: Path, recurse: bool = False) -> list[Path]:
    if not recurse:
        return sorted(p for p in source_dir.glob("*.py") if p.is_file())
    matches: list[Path] = []
    for p in source_dir.rglob("*.py"):
        if not p.is_file():
            continue
        if any(part in _SKIP_DIRS for part in p.relative_to(source_dir).parts):
            continue
        matches.append(p)
    return sorted(matches)


def collect_markdown_files(source_dir: Path, recurse: bool = False) -> list[Path]:
    if not recurse:
        return sorted(p for p in source_dir.glob("*.md") if p.is_file())
    matches: list[Path] = []
    for p in source_dir.rglob("*.md"):
        if not p.is_file():
            continue
        if any(part in _SKIP_DIRS for part in p.relative_to(source_dir).parts):
            continue
        matches.append(p)
    return sorted(matches)


def process_source(
    source_rel: str,
    pkg_subpath: str,
    docs_subpath: str,
    label: str,
    recurse: bool = False,
) -> list[Converted]:
    """Convert every notebook under ``source_rel`` into the package + docs.

    When ``recurse`` is true, subdirectories are walked and the relative path
    of each notebook under the source is mirrored under ``pkg_subpath`` /
    ``docs_subpath``. Companion ``.py`` and ``.md`` files are copied to the
    same location.
    """
    source_dir = ROOT / source_rel
    if not source_dir.exists():
        print(f"  [skip] missing source dir: {source_rel}")
        return []

    pkg_root = PACKAGE_ROOT / pkg_subpath
    docs_root = DOCS_ROOT / docs_subpath
    write_init(pkg_root / "__init__.py", label)

    converted: list[Converted] = []
    for nb_path in collect_notebook_files(source_dir, recurse=recurse):
        rel = nb_path.relative_to(source_dir)
        # Mirror the source's subdirectory layout under pkg/docs.
        sub = rel.parent if recurse else Path("")
        sub_safe = Path(*(slugify_part(p) for p in sub.parts)) if sub != Path("") else sub
        pkg_dir = pkg_root / sub_safe
        docs_dir = docs_root / sub_safe
        result = convert_notebook(nb_path, pkg_dir, docs_dir, source_rel)
        converted.append(result)
        print(f"  notebook: {nb_path.relative_to(ROOT)} -> "
              f"{result.py_path.relative_to(ROOT)} + {result.md_path.relative_to(ROOT)}")

    # Copy companion .py files (mirroring subdirectory layout when recursing).
    for py_path in collect_python_files(source_dir, recurse=recurse):
        rel = py_path.relative_to(source_dir)
        sub = rel.parent if recurse else Path("")
        sub_safe = Path(*(slugify_part(p) for p in sub.parts)) if sub != Path("") else sub
        target = pkg_root / sub_safe / py_path.name
        target.parent.mkdir(parents=True, exist_ok=True)
        if target.suffix == ".py" and target.name != "__init__.py":
            write_init(target.parent / "__init__.py", f"{label} - {sub_safe or 'root'} helper modules.")
        shutil.copy2(py_path, target)
        print(f"  copy py:  {py_path.relative_to(ROOT)} -> {target.relative_to(ROOT)}")

    # Copy companion .md files (mirroring subdirectory layout when recursing).
    for md_path in collect_markdown_files(source_dir, recurse=recurse):
        rel = md_path.relative_to(source_dir)
        sub = rel.parent if recurse else Path("")
        sub_safe = Path(*(slugify_part(p) for p in sub.parts)) if sub != Path("") else sub
        # If the filename contains spaces or other unsafe characters, rewrite it.
        safe_name = slugify_part(md_path.stem) + md_path.suffix
        target = docs_root / sub_safe / safe_name
        target.parent.mkdir(parents=True, exist_ok=True)
        shutil.copy2(md_path, target)
        print(f"  copy md:  {md_path.relative_to(ROOT)} -> {target.relative_to(ROOT)}")

    return converted


def process_root_notebooks() -> list[Converted]:
    converted: list[Converted] = []
    for filename, pkg_subpath, docs_subpath in ROOT_NOTEBOOKS:
        nb_path = ROOT / filename
        if not nb_path.exists():
            print(f"  [skip] missing root notebook: {filename}")
            continue
        pkg_dir = PACKAGE_ROOT / pkg_subpath
        docs_dir = DOCS_ROOT / docs_subpath
        write_init(pkg_dir / "__init__.py", "Brain Tumor Classification")
        result = convert_notebook(nb_path, pkg_dir, docs_dir, ".")
        converted.append(result)
        print(f"  notebook: {filename} -> "
              f"{result.py_path.relative_to(ROOT)} + {result.md_path.relative_to(ROOT)}")
    return converted


def write_docs_index(all_sections: list[tuple[str, str, list[Converted]]]) -> None:
    """Write a top-level docs/README.md index linking every section."""
    lines: list[str] = ["# Be The Boss in Python - Documentation", ""]
    lines.append("This index is generated by `extract_and_convert.py`. Each entry below links "
                 "to a Markdown file under `docs/`; the equivalent runnable Python module "
                 "lives under `be_theboss/`.")
    lines.append("")

    for label, docs_subpath, items in all_sections:
        lines.append(f"## {label}")
        lines.append("")
        for item in items:
            rel = item.md_path.relative_to(DOCS_ROOT).as_posix()
            lines.append(f"- [{item.title}]({rel})")
        if not items:
            lines.append("- _(no notebooks in this section)_")
        lines.append("")

    (DOCS_ROOT / "README.md").write_text("\n".join(lines).rstrip() + "\n", encoding="utf-8")


# ---------------------------------------------------------------------------
# Entrypoint
# ---------------------------------------------------------------------------

def main() -> int:
    print(f"Project root: {ROOT}")
    print(f"Package root: {PACKAGE_ROOT}")
    print(f"Docs root:    {DOCS_ROOT}")
    print()

    reset_dir(PACKAGE_ROOT)
    reset_dir(DOCS_ROOT)

    write_init(PACKAGE_ROOT / "__init__.py", "Be The Boss in Python - learning package.")
    write_init(DOCS_ROOT / ".gitkeep", "")  # placeholder so the dir tracks in git

    all_sections: list[tuple[str, str, list[Converted]]] = []
    for source_rel, pkg_subpath, docs_subpath, label in SOURCES:
        # `intuitive-ml` has notebooks in a subdirectory; recurse into it.
        recurse = source_rel == "intuitive-ml"
        print(f"[section] {label} ({source_rel})")
        items = process_source(source_rel, pkg_subpath, docs_subpath, label, recurse=recurse)
        all_sections.append((label, docs_subpath, items))
        print()

    print("[section] Brain Tumor Classification (root)")
    root_items = process_root_notebooks()
    all_sections.append(("Brain Tumor Classification", "brain_tumor", root_items))
    print()

    write_docs_index(all_sections)
    print("Wrote docs/README.md")

    total_py = sum(1 for _ in PACKAGE_ROOT.rglob("*.py"))
    total_md = sum(1 for _ in DOCS_ROOT.rglob("*.md"))
    print(f"\nDone. {total_py} .py files and {total_md} .md files written.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
