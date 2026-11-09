"""Build resume/rendercv_output/Sion_Yoon_CV.pdf from resume/Sion_Yoon_CV.yaml.

RenderCV only accepts a fixed set of bullet characters, and an en dash is not
one of them. So: render with RenderCV, swap the bullet in the generated Typst
file for an en dash, and compile that file again.

Usage: .venv-resume/bin/python resume/build.py
"""
import pathlib
import subprocess
import sys

from rendercv.renderer.pdf_png import get_typst_compiler

ROOT = pathlib.Path(__file__).resolve().parent
YAML = ROOT / "Sion_Yoon_CV.yaml"
OUT = ROOT / "rendercv_output"
TYP = OUT / "Sion_Yoon_CV.typ"
PDF = OUT / "Sion_Yoon_CV.pdf"
PNG = OUT / "Sion_Yoon_CV_{p}.png"

rendercv = pathlib.Path(sys.executable).with_name("rendercv")
subprocess.run(
    [str(rendercv), "render", str(YAML), "--dont-generate-html", "--dont-generate-markdown", "--dont-generate-png"],
    check=True,
    cwd=ROOT.parent,
)

src = TYP.read_text()
old = 'entries-highlights-bullet:  "•" ,'
if old not in src:
    sys.exit(f"bullet setting not found in {TYP}; RenderCV output format changed?")
TYP.write_text(src.replace(old, 'entries-highlights-bullet: "–",'))

# Same compiler setup RenderCV uses (bundled fonts, Typst packages).
compiler = get_typst_compiler(YAML, OUT)
compiler.compile(input=TYP, format="pdf", output=PDF)
for old_png in OUT.glob("Sion_Yoon_CV_*.png"):
    old_png.unlink()
compiler.compile(input=TYP, format="png", output=str(PNG), ppi=150)
print("pages:", len(list(OUT.glob("Sion_Yoon_CV_*.png"))), "->", PDF)
