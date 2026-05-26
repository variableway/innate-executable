#!/usr/bin/env bash
set -euo pipefail

BOLD="\033[1m"
GREEN="\033[32m"
YELLOW="\033[33m"
CYAN="\033[36m"
RESET="\033[0m"

get_script_dir() {
    local source="${BASH_SOURCE[0]}"
    while [ -h "$source" ]; do
        local dir="$(cd -P "$(dirname "$source")" && pwd)"
        source="$(readlink "$source")"
        [[ $source != /* ]] && source="$dir/$source"
    done
    cd "$(dirname "$source")" && pwd
}

SCRIPT_DIR="$(get_script_dir)"
SCRIPT_PARENT="$(dirname "$SCRIPT_DIR")"
SCRIPT_GRANDPARENT="$(dirname "$SCRIPT_PARENT")"
SCRIPT_GREAT_GRANDPARENT="$(dirname "$SCRIPT_GRANDPARENT")"
MONO_ROOT="$(dirname "$SCRIPT_GREAT_GRANDPARENT")"
PLAYGROUND_DIR="$SCRIPT_PARENT/playground"
DESKTOP_DIR="$PLAYGROUND_DIR/apps/desktop"

log()   { echo -e "${GREEN}[+]${RESET} $1"; }
warn()  { echo -e "${YELLOW}[!]${RESET} $1"; }
info()  { echo -e "${CYAN}[*]${RESET} $1"; }

usage() {
    echo "${BOLD}Innate Executable - Start Script${RESET}"
    echo "=================================="
    echo ""
    echo "Usage: $0 <command>"
    echo ""
    echo "Commands:"
    echo "  dev         Start in development mode (Tauri + HMR)"
    echo "  dev:fast    Pre-compile Rust deps, then start dev (faster first run)"
    echo "  build       Build the application"
    echo "  build:web    Build only the frontend (Next.js)"
    echo "  build:rust  Build only the Rust backend"
    echo "  clean       Clean build artifacts"
    echo "  status      Check prerequisites"
    echo ""
    echo "Examples:"
    echo "  $0 dev                # Start development"
    echo "  $0 dev:fast          # Pre-compile then dev (recommended first time)"
    echo "  $0 build              # Full build"
    echo "  $0 build:web          # Frontend only"
    echo ""
    echo "Speed Tips:"
    echo "  - First run: use 'dev:fast' to pre-compile dependencies"
    echo "  - Web changes: HMR auto-updates, no restart needed"
    echo "  - Rust changes: Tauri increments compile"
}

check_prerequisites() {
    local missing=0

    if ! command -v node >/dev/null 2>&1; then
        warn "Node.js not found"
        missing=1
    else
        info "Node.js: $(node -v)"
    fi

    if ! command -v pnpm >/dev/null 2>&1; then
        warn "pnpm not found"
        missing=1
    else
        info "pnpm: $(pnpm -v)"
    fi

    if ! command -v rustc >/dev/null 2>&1; then
        warn "Rust not found"
        missing=1
    else
        info "Rust: $(rustc --version | cut -d' ' -f2)"
    fi

    if ! command -v cargo >/dev/null 2>&1; then
        warn "Cargo not found"
        missing=1
    fi

    if [ $missing -eq 1 ]; then
        echo ""
        warn "Some prerequisites are missing. Please install them first."
        exit 1
    fi
}

install_deps() {
    log "Installing dependencies..."
    cd "$PLAYGROUND_DIR"
    if pnpm install --frozen-lockfile 2>/dev/null; then
        log "Dependencies installed (frozen lockfile)"
    else
        pnpm install
    fi
}

cmd_dev() {
    log "Starting Innate Executable in DEV mode..."
    log "Project: $DESKTOP_DIR"
    echo ""
    info "This will:"
    info "  1. Install dependencies if needed"
    info "  2. Start Next.js dev server (http://localhost:5001)"
    info "  3. Start Tauri desktop app"
    echo ""
    info "✅ Web changes: Hot Module Replacement (HMR) - 无需重启"
    echo ""

    install_deps

    cd "$DESKTOP_DIR"
    log "Launching Tauri dev server..."
    pnpm tauri dev
}

cmd_dev_fast() {
    log "🚀 Fast Dev Mode - Pre-compiling dependencies first..."
    log "Project: $DESKTOP_DIR"
    echo ""

    install_deps

    info "Step 1/3: Pre-compiling Rust dependencies in background..."
    cd "$DESKTOP_DIR"
    cargo build 2>&1 &
    local cargo_pid=$!

    info "Step 2/3: Starting Next.js dev server..."
    cd "$DESKTOP_DIR"
    pnpm next dev --port 5001 &
    local next_pid=$!

    echo ""
    info "Background processes started:"
    info "  - Cargo compilation (PID: $cargo_pid)"
    info "  - Next.js dev server (PID: $next_pid)"
    echo ""
    info "Next.js available at: http://localhost:5001"
    info "Waiting for Rust compilation to complete..."
    echo ""

    wait $cargo_pid
    local cargo_status=$?

    echo ""
    if [ $cargo_status -eq 0 ]; then
        log "✅ Rust dependencies compiled!"
        log "Now launching Tauri dev server..."
        echo ""
        pnpm tauri dev
    else
        warn "Cargo compilation may have issues, but continuing..."
        pnpm tauri dev
    fi
}

cmd_build() {
    log "Building Innate Executable..."
    install_deps

    echo ""
    info "Building in parallel (frontend + Rust)..."
    echo ""

    log "Building frontend (Next.js) in background..."
    cd "$DESKTOP_DIR"
    pnpm build &
    local web_pid=$!

    log "Building Rust backend in background..."
    cargo build --release 2>&1 &
    local rust_pid=$!

    echo ""
    info "Build processes started:"
    info "  - Frontend (PID: $web_pid)"
    info "  - Rust (PID: $rust_pid)"
    echo ""

    wait $web_pid
    log "✅ Frontend build complete!"

    wait $rust_pid
    log "✅ Rust build complete!"

    echo ""
    log "Build complete!"
    echo ""
    echo "Output:"
    echo "  App bundle: $DESKTOP_DIR/src-tauri/target/release/bundle/macos/Innate Playground.app"
    echo ""
}

cmd_build_web() {
    log "Building frontend only..."
    install_deps

    cd "$DESKTOP_DIR"
    pnpm build

    log "Frontend build complete!"
    log "Output: $DESKTOP_DIR/out/"
}

cmd_build_rust() {
    log "Building Rust backend only..."

    cd "$DESKTOP_DIR"
    cargo build --release --package innate_playground_lib 2>/dev/null || \
    cargo build --release

    log "Rust build complete!"
}

cmd_clean() {
    log "Cleaning build artifacts..."

    if [ -d "$DESKTOP_DIR/out" ]; then
        rm -rf "$DESKTOP_DIR/out"
        log "Removed: $DESKTOP_DIR/out"
    fi

    if [ -d "$DESKTOP_DIR/.next" ]; then
        rm -rf "$DESKTOP_DIR/.next"
        log "Removed: $DESKTOP_DIR/.next"
    fi

    if [ -d "$DESKTOP_DIR/src-tauri/target" ]; then
        rm -rf "$DESKTOP_DIR/src-tauri/target"
        log "Removed: $DESKTOP_DIR/src-tauri/target"
    fi

    log "Clean complete!"
}

cmd_status() {
    echo "${BOLD}Innate Executable - Status Check${RESET}"
    echo "==================================="
    echo ""

    check_prerequisites

    echo ""
    info "Project directories:"
    echo "  Script:     $SCRIPT_DIR"
    echo "  Mono:       $MONO_ROOT"
    echo "  Playground: $PLAYGROUND_DIR"
    echo "  Desktop:    $DESKTOP_DIR"
    echo ""

    if [ -d "$PLAYGROUND_DIR/node_modules" ]; then
        log "Dependencies: installed"
    else
        warn "Dependencies: not installed (run '$0 dev' to install)"
    fi

    if [ -f "$DESKTOP_DIR/src-tauri/target/release/innate-playground" ]; then
        log "Binary: built"
    else
        warn "Binary: not built"
    fi

    echo ""
}

COMMAND="${1:-}"

case "$COMMAND" in
    dev|start)
        cmd_dev
        ;;
    dev:fast|fast)
        cmd_dev_fast
        ;;
    build)
        cmd_build
        ;;
    build:web|frontend)
        cmd_build_web
        ;;
    build:rust|rust)
        cmd_build_rust
        ;;
    clean|cleanup)
        cmd_clean
        ;;
    status|check)
        cmd_status
        ;;
    help|--help|-h)
        usage
        ;;
    "")
        usage
        exit 0
        ;;
    *)
        warn "Unknown command: $COMMAND"
        usage
        exit 1
        ;;
esac