# Pdt to text

_Source notebook: `100-programs/99_pdt_to_text.ipynb`._

### 101. Extract Text from PDF ⚡️

```python
%pip install pdfplumber -q
```

Output:

```
Note: you may need to restart the kernel to use updated packages.
```

```python
import pdfplumber as pp

with pp.open('book.pdf') as book:
    for page_no, page in enumerate(book.pages, start=1):
        print(f'{page_no = }')
        data = page.extract_text()
        print(data.strip())
        print('-'*45)
```

Output:

```
page_no = 1
Build Your Book from Jupyter 
Notebook
1. create virtual env
 
conda create -n pybook python=3.10 
conda activate pybook
2. Install Jupyter Book
pip install -U jupyter-book
3. Generate Sample Book
jupyter-book create pyspace
4. Book structure
Build Your Book from Jupyter Notebook 1
---------------------------------------------
page_no = 2
tree pyspace/ 
pyspace/ 
├── _config.yml 
├── _toc.yml 
├── intro.md 
├── logo.png 
├── markdown-notebooks.md 
├── markdown.md 
├── notebooks.ipynb 
├── references.bib 
└── requirements.txt 
 
0 directories, 9 files
5. Build your book 
jupyter-book build pyspace/ 
 
 
_build/html 
├── _sources 
│   ├── intro.md 
│   ├── markdown-notebooks.ipynb 
│   ├── markdown-notebooks.md 
│   ├── markdown.md 
│   └── notebooks.ipynb 
├── _sphinx_design_static 
│   ├── design-style.b7bb847fb20b106c3d81b95245e65545.min.css 
│   └── design-tabs.js 
├── _static 
│   ├── basic.css 
│   ├── check-solid.svg 
│   ├── clipboard.min.js 
│   ├── copy-button.svg 
│   ├── copybutton.css 
│   ├── copybutton.js
6. Add your own content
a. Create a new markdown or jupyter notebook.  
b. Add the new file to 
_toc.yml
format: jb-book 
root: intro 
chapters: 
- file: markdown 
Build Your Book from Jupyter Notebook 2
---------------------------------------------
page_no = 3
- file: notebooks 
- file: markdown-notebooks 
- file: mymarkdownfile 
 ^^
- file: mymarkdownfile
c. Build the book again to pick up the changes. 
7. Publish your book online
We will publish our book on Github Pages.  Let’s start with creating Github repo
1. initialize your local book folder with git >   
git commit
2. Commit all the changes 
a. 
git add *
b.  commit the changes 
git commit -m 'all the files added'
3. Link your Github repo with local book repo
a. 
git remote add origin  https://github.com/ <your_repo>
4. Push the changes to Github
a. 
git push -u origin main
5. Install   >   python module makes it easy to publish on 
ghp-import ghp-import
Github Pages.
6. Run 
ghp-import -n -p -f _build/html
7. After a couple of minutes, your book will be online. Here is mine > 
https://afizs.github.io/pyspace/intro.html 
Build Your Book from Jupyter Notebook 3
---------------------------------------------
```
