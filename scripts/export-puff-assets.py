"""Export PUFF final brand masters and all social formats from existing source vectors."""
from pathlib import Path
from lxml import etree
from PIL import Image
import cairosvg, numpy as np, json, zipfile

root=Path.cwd()
brand=root/"assets"/"brand"
masters=brand/"master"
social=brand/"social"
archives=brand/"archives"
for p in (masters,social,archives): p.mkdir(parents=True,exist_ok=True)
src=json.loads(Path("/tmp/puff-vector-source.json").read_text())
art=src["art"]
glyphs=src["glyphs"]
SVG="http://www.w3.org/2000/svg"
def tag(name):return "{"+SVG+"}"+name

def svg_file(white_ink, wordmark_only):
    ink="#ffffff" if white_ink else "#000000"
    paper="#000000" if white_ink else "#ffffff"
    height=900 if wordmark_only else 1600
    root=etree.Element(tag("svg"),nsmap={None:SVG},attrib={
       "width":"1600","height":str(height),"viewBox":"0 0 1600 "+str(height),"role":"img"})
    etree.SubElement(root,tag("title")).text="PUFF "+("wordmark" if wordmark_only else "full logo")
    etree.SubElement(root,tag("rect"),attrib={
       "width":"1600","height":str(height),"fill":paper})
    if not wordmark_only:
        drawing=etree.SubElement(root,tag("g"),attrib={
          "transform":"translate(452.34 136) scale(2.10) translate(-35.8 -26)",
          "fill":"none","stroke":ink,"stroke-width":"3",
          "stroke-linecap":"round","stroke-linejoin":"round"})
        def strokes(group):
            for s in group["strokes"]:
                etree.SubElement(drawing,tag("path"),attrib={
                  "d":s["d"],"fill":paper if s["fill"] else "none"})
        for g in art["back"]:strokes(g)
        for groupname in ("stem","body","details"):strokes(art[groupname])
        dots=etree.SubElement(drawing,tag("g"),attrib={"stroke":"none","fill":ink})
        for d in art["dots"]:
            etree.SubElement(dots,tag("circle"),attrib={
                "cx":str(d["cx"]),"cy":str(d["cy"]),"r":str(d["r"])})
        for g in art["front"]:strokes(g)
    letters=etree.SubElement(root,tag("g"),attrib={
       "transform":"translate(182.90 49.20) scale(3.00)" if wordmark_only else "translate(244.61 800.00) scale(2.70)"})
    for g in glyphs:etree.SubElement(letters,tag("path"),attrib={"d":g,"fill":ink})
    return etree.tostring(root,xml_declaration=True,encoding="utf-8",pretty_print=True)

variants=["Full_White_on_Black","Full_Black_on_White",
          "Wordmark_White_on_Black","Wordmark_Black_on_White"]
formats=[
 ("WhatsApp","Profile_640x640",640,640,"avatar"),
 ("Instagram_Threads","Profile_1080x1080",1080,1080,"avatar"),
 ("Facebook_X_LinkedIn","Profile_400x400",400,400,"avatar"),
 ("TikTok","Profile_720x720",720,720,"avatar"),
 ("Pinterest","Profile_600x600",600,600,"avatar"),
 ("YouTube","Profile_800x800",800,800,"avatar"),
 ("WhatsApp_Instagram_Facebook","Story_Status_1080x1920",1080,1920,"story"),
 ("Social_Posts","Square_1080x1080",1080,1080,"square"),
 ("Social_Posts","Portrait_1080x1350",1080,1350,"portrait"),
 ("Social_Covers","Banner_1500x500",1500,500,"banner")]
limits={"avatar":(.68,.68),"square":(.82,.82),"portrait":(.80,.72),
        "story":(.78,.55),"banner":(.65,.79)}

for var in variants:
    svg=masters/("PUFF_"+var+".svg")
    png=masters/("PUFF_"+var+".png")
    raw=svg_file(var.endswith("White_on_Black"),var.startswith("Wordmark"))
    svg.write_bytes(raw)
    cairosvg.svg2png(bytestring=raw,write_to=str(png))
    image=Image.open(png).convert("RGB")
    background=(0,0,0) if var.endswith("White_on_Black") else (255,255,255)
    arr=np.asarray(image)
    mask=np.any(np.abs(arr.astype("int16")-np.array(background))>45,axis=2)
    ys,xs=np.where(mask)
    if not len(xs):raise RuntimeError("No artwork in "+str(png))
    logo=image.crop((int(xs.min()),int(ys.min()),int(xs.max())+1,int(ys.max())+1))
    for folder,suffix,w,h,mode in formats:
        dest=social/folder
        dest.mkdir(parents=True,exist_ok=True)
        page=Image.new("RGB",(w,h),background)
        rw,rh=limits[mode]
        factor=min(w*rw/logo.width,h*rh/logo.height)
        resized=logo.resize((max(1,round(logo.width*factor)),max(1,round(logo.height*factor))),Image.Resampling.LANCZOS)
        page.paste(resized,((w-resized.width)//2,(h-resized.height)//2))
        page.save(dest/("PUFF_"+var+"_"+suffix+".png"),optimize=True,compress_level=8)
pngs=sorted(social.rglob("*.png"))
assert len(pngs)==40, "Expected 40 social PNGs, found "+str(len(pngs))
for f in pngs:
    with Image.open(f) as image:image.verify()
for name,items in [
  ("PUFF_Logo_Kit.zip",sorted(masters.glob("PUFF_*"))),
  ("PUFF_WhatsApp_Profile_Logos.zip",sorted((social/"WhatsApp").glob("*.png"))),
  ("PUFF_Social_Media_Logo_Kit.zip",pngs)]:
    with zipfile.ZipFile(archives/name,"w",compression=zipfile.ZIP_DEFLATED,compresslevel=8) as z:
        for f in items:
            name_in_zip=str(f.relative_to(social)) if "Social_Media" in name else f.name
            z.write(f,arcname=name_in_zip)
print("SUCCESS: 4 full/wordmark SVGs + 4 PNG masters + 40 social PNGs + 3 ZIP kits")
