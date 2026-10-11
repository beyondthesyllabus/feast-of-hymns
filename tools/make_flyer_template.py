from PIL import Image, ImageDraw, ImageFont, ImageFilter, ImageChops
import numpy as np
W,H=1080,1350
F='/usr/share/fonts/truetype/google-fonts/Poppins-%s.ttf'
def f(s,w='Bold'): return ImageFont.truetype(F%w,s)
src=Image.open('/mnt/user-data/uploads/IMG-20261007-WA0043.jpg').convert('RGB')

# background gradient
g=np.zeros((H,W,3),float)
top=np.array([6,28,130]);mid=np.array([10,52,175]);bot=np.array([4,18,80])
for y in range(H):
    t=y/H
    c=top+(mid-top)*(t/0.5) if t<0.5 else mid+(bot-mid)*((t-0.5)/0.5)
    g[y]=c
bg=Image.fromarray(g.astype('uint8'))
# choir photo faded
ch=src.crop((250,275,2000,775)).resize((1500,int(1500*500/1750)))
ch=ch.crop((210,0,210+W,ch.height)).convert('RGB').filter(ImageFilter.GaussianBlur(1.5))
mask=Image.linear_gradient('L').resize((W,ch.height)).transpose(Image.FLIP_TOP_BOTTOM)
mask=mask.point(lambda v:int(max(0,(v-0))**1.3/255**0.3*0.9))
bg.paste(ch,(0,0),mask)
# radial glow behind frame
glow=Image.new('RGB',(W,H),(0,0,0));d=ImageDraw.Draw(glow)
d.ellipse((140,330,940,1130),fill=(40,120,255))
glow=glow.filter(ImageFilter.GaussianBlur(160))
bg=ImageChops.screen(bg,glow.point(lambda v:int(v*0.45)))
# sparkles
import random;random.seed(4)
sp=Image.new('RGBA',(W,H),(0,0,0,0));sd=ImageDraw.Draw(sp)
for _ in range(0):
    x,y=random.randint(0,W),random.randint(0,H);r=random.choice([1,1,2,3])
    sd.ellipse((x-r,y-r,x+r,y+r),fill=(255,230,150,random.randint(60,190)))
sp=sp.filter(ImageFilter.GaussianBlur(0.8))
bg=bg.convert('RGBA');bg.alpha_composite(sp)

# --- hymn motifs ---
bg=bg.convert('RGBA')
mo=Image.new('RGBA',(W,H),(0,0,0,0));md=ImageDraw.Draw(mo)
# pipe organ along bottom
import math
n=27;pw=W/n
for i in range(n):
    hgt=190+170*abs(math.sin(i*0.37+0.6))+ (60 if i%5==0 else 0)
    x0=i*pw+4;x1=(i+1)*pw-4
    top=H-hgt-120
    for k in range(int(x1-x0)):
        t_=k/(x1-x0);sh=int(60+150*math.sin(t_*math.pi))
        md.line((x0+k,top,x0+k,H),fill=(120+sh//3,170+sh//3,255,int(70+sh*0.35)))
    md.ellipse((x0+(x1-x0)/2-9,top+30,x0+(x1-x0)/2+9,top+60),fill=(10,30,110,150))
    md.rectangle((x0,top,x1,top+6),fill=(255,215,100,150))
mo=mo.filter(ImageFilter.GaussianBlur(0.6))
import numpy as _np
_a=_np.array(mo).astype(float)
_yy=_np.linspace(0,1,H)[:,None]
_f=_np.clip((_yy-0.62)/0.38,0,1)**1.2*0.55
_a[...,3]*=_f
mo=Image.fromarray(_a.astype('uint8'),'RGBA')
bg.alpha_composite(mo)
# staff lines with notes on both sides
st=Image.new('RGBA',(W,H),(0,0,0,0));sd2=ImageDraw.Draw(st)
fnt=ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf',64)
for (xa,xb,y0) in [(0,300,640),(780,W,640),(0,300,860),(780,W,860)]:
    for k in range(5): sd2.line((xa,y0+k*14,xb,y0+k*14),fill=(255,255,255,70),width=2)
for (x,y,ch_) in [(40,606,'\u266B'),(150,640,'\u266A'),(215,614,'\u266B'),(820,622,'\u266A'),(920,600,'\u266B'),(1000,640,'\u266A'),(60,826,'\u266A'),(170,846,'\u266B'),(840,830,'\u266B'),(950,850,'\u266A')]:
    sd2.text((x,y),ch_,font=fnt,fill=(255,215,100,150))
if False:
    cf=ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf',150)
    pass
bg.alpha_composite(st)
img=bg;d=ImageDraw.Draw(img)

def ctext(y,t,font,fill,sp_=0,shadow=True):
    w=sum(d.textlength(c,font=font)+sp_ for c in t)-sp_
    x=(W-w)/2
    if shadow:
        xx=x
        for c in t:
            d.text((xx+3,y+4),c,font=font,fill=(0,0,30,200));xx+=d.textlength(c,font=font)+sp_
    for c in t:
        d.text((x,y),c,font=font,fill=fill);x+=d.textlength(c,font=font)+sp_

# header
ctext(34,"GOD'S HOUSE OF REFUGE",f(40),(255,255,255),2)
ctext(86,"HOUSE OF PRAISE",f(22,'Medium'),(255,255,255),14,False)
# logo crop
logo=src.crop((420,110,540,190)).convert('RGBA')
lg=Image.open('logo.png');lw=76;lg=lg.resize((lw,int(lg.height*lw/lg.width)),Image.LANCZOS)
img.alpha_composite(lg,(188,int(76-lg.height/2)))
d=ImageDraw.Draw(img)
# presents
ctext(120,"P R E S E N T S",f(17,'Medium'),(235,235,255),4,False)

# title
t=Image.open('title.png');tw=540;t=t.resize((tw,int(t.height*tw/t.width)),Image.LANCZOS)
P=40;pa=Image.new('L',(t.width+2*P,t.height+2*P),0);pa.paste(t.split()[3].point(lambda v:int(v*0.7)),(P,P))
sh=Image.new('RGBA',pa.size,(0,0,0,0));sh.putalpha(pa.filter(ImageFilter.GaussianBlur(10)))
tx=(W-tw)//2;ty=140
img.alpha_composite(sh,(tx+4-P,ty+10-P));img.alpha_composite(t,(tx,ty))
ty_end=ty+t.height

# theme ribbon
rib=Image.new('RGBA',(W,H),(0,0,0,0));rd=ImageDraw.Draw(rib)
ry=ty_end+6
rd.polygon([(290,ry),(790,ry),(775,ry+40),(790,ry+80),(290,ry+80),(305,ry+40)],fill=(190,20,30,255))
rd.polygon([(290,ry),(790,ry),(790,ry+6),(290,ry+6)],fill=(230,60,60,255))
img.alpha_composite(rib);d=ImageDraw.Draw(img)
ft=f(26,'Bold');fl=f(18,'Medium')
a="THEME:  ";b="PRAISE THAT PREVAILS"
wa=d.textlength(a,font=fl);wb=d.textlength(b,font=ft);x0=(W-wa-wb)/2
d.text((x0,ry+24),a,font=fl,fill=(255,225,225));d.text((x0+wa,ry+16),b,font=ft,fill=(255,255,255))

# photo frame
fs=350;fx=(W-fs)//2;fy=ry+132
fr=Image.new('RGBA',(W,H),(0,0,0,0));fd=ImageDraw.Draw(fr)
fd.rectangle((fx-34,fy-34,fx+fs+34,fy+fs+34),fill=(255,200,40,255))
fd.rectangle((fx-28,fy-28,fx+fs+28,fy+fs+28),fill=(8,30,110,255))
fd.rectangle((fx-12,fy-12,fx+fs+12,fy+fs+12),fill=(255,200,40,255))
fd.rectangle((fx-6,fy-6,fx+fs+6,fy+fs+6),fill=(8,30,110,255))
fd.rectangle((fx,fy,fx+fs,fy+fs),fill=(255,255,255,255))
fs_sh=fr.filter(ImageFilter.GaussianBlur(18))
img.alpha_composite(Image.new('RGBA',(W,H),(0,0,0,0)))
img.alpha_composite(fs_sh.point(lambda v:v) if False else fs_sh)
img.alpha_composite(fr);d=ImageDraw.Draw(img)
# corner accents
for (cx,cy) in []:
    d.ellipse((cx-9,cy-9,cx+9,cy+9),fill=(255,230,120,255),outline=(190,20,30,255),width=3)
fy_end=fy+fs+34
# ribbon I WILL BE
by=fy_end+14
rib=Image.new('RGBA',(W,H),(0,0,0,0));rd=ImageDraw.Draw(rib)
rd.polygon([(300,by),(780,by),(765,by+36),(780,by+72),(300,by+72),(315,by+36)],fill=(205,28,28,255))
rd.polygon([(300,by),(780,by),(780,by+8),(300,by+8)],fill=(240,80,70,255))
rd.rectangle((300,by+66,780,by+72),fill=(120,10,20,255))
img.alpha_composite(rib);d=ImageDraw.Draw(img)
ctext(by+10,"I WILL BE",f(44),(255,255,255),10,False)
# ATTENDING
ay=by+44
fa=f(138)
w=d.textlength("ATTENDING",font=fa)
while w>900: fa=ImageFont.truetype(F%'Bold',fa.size-4);w=d.textlength("ATTENDING",font=fa)
# gradient gold text
tm=Image.new('L',(W,H),0);ImageDraw.Draw(tm).text(((W-w)/2,ay),"ATTENDING",font=fa,fill=255)
gold=Image.new('RGBA',(W,H));gp=gold.load()
y0=ay+20;y1=ay+fa.size+40
grad=np.zeros((H,W,4),np.uint8)
for y in range(H):
    t_=min(max((y-y0)/(y1-y0),0),1)
    grad[y,:]=[255,int(240-70*t_),int(60-30*t_),255]
gold=Image.fromarray(grad,'RGBA')
shadow=Image.new('RGBA',(W,H),(0,0,0,0));shadow.putalpha(tm.point(lambda v:int(v*0.8)));shadow=shadow.filter(ImageFilter.GaussianBlur(6))
img.alpha_composite(shadow,(4,8))
gold.putalpha(tm);img.alpha_composite(gold);d=ImageDraw.Draw(img)

# details bar
bh=104;byb=H-bh-34;bx0,bx1=40,W-40
bar=Image.new('RGBA',(W,H),(0,0,0,0));bd=ImageDraw.Draw(bar)
bd.rounded_rectangle((bx0,byb,bx1,byb+bh),14,fill=(5,22,95,240),outline=(255,200,40,255),width=3)
for xx in (bx0+290,bx1-290): bd.line((xx,byb+16,xx,byb+bh-16),fill=(255,200,40,200),width=2)
img.alpha_composite(bar);d=ImageDraw.Draw(img)
def cell(cx,label,lines,sz=20):
    lw=d.textlength(label,font=f(22));d.text((cx-lw/2,byb+12),label,font=f(22),fill=(255,205,50))
    yy=byb+44
    for l in lines:
        w_=d.textlength(l,font=f(sz,'Bold'));d.text((cx-w_/2,yy),l,font=f(sz,'Bold'),fill=(255,255,255));yy+=sz+6
cell((bx0+bx0+290)/2,"Date:",["Sun. 25th Oct. 2026"],18)
cell((bx0+290+bx1-290)/2,"Venue:",["God's House of Refuge","8 Ikot Ebido Street, Uyo"],19)
cell((bx1-290+bx1)/2,"Time:",["5:00pm prompt","Red Carpet II: 4:30pm"],18)
t2="Red Carpet II  •  4:30pm"
w_=d.textlength(t2,font=f(17,'Medium'));d.text(((bx1-290+bx1)/2-w_/2,byb+44+26+6),t2,font=f(17,'Medium'),fill=(255,120,120)) if False else None
# footer line
ctext(H-30,"RED CARPET II  •  4:30PM        MINISTERING: HOUSE OF JUDAH • YOUTH CHOIR • THE EKAS • YAMA CHORAL GROUP",f(11,'Medium'),(200,205,255),1,False) if False else None
img=img.convert('RGB');img.save('/mnt/user-data/outputs/Feast_of_Hymns_2026_I_Will_Be_Attending.png')
print(by,ay,byb,fy,fy_end)
