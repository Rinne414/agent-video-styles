import sys
from fontTools import subset
from fontTools.ttLib import TTFont
from fontTools.varLib import instancer
src, out = sys.argv[1], sys.argv[2]
chars = []
for hi in range(0xB0, 0xD8):          # GB2312 level-1 hanzi (3755)
    for lo in range(0xA1, 0xFF):
        try: chars.append(bytes([hi, lo]).decode("gb2312"))
        except UnicodeDecodeError: pass
for hi in range(0xA1, 0xAA):          # GB2312 symbols, fullwidth punct
    for lo in range(0xA1, 0xFF):
        try: chars.append(bytes([hi, lo]).decode("gb2312"))
        except UnicodeDecodeError: pass
chars += [chr(c) for c in range(0x20, 0x7F)] + list("·—…“”‘’《》〈〉「」、，。！？：；（）")
f = TTFont(src)
opt = subset.Options(); opt.flavor = "woff2"; opt.layout_features = ["*"]; opt.notdef_outline = True
s = subset.Subsetter(opt); s.populate(text="".join(chars)); s.subset(f)
f = instancer.instantiateVariableFont(f, {"wght": (400, 800)})
f.flavor = "woff2"; f.save(out)
