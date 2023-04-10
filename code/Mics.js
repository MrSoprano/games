//this.Number.create(0,dy,0,0,num,this.Def.atlas,this.Def.imgs, this,0,
 //   0,null,null,this.Def.marg,this.NumberScale);

CImagesNum = function (papa) {
    this.Papa = papa;
    this.Imgs = [];
    this.Widths = [];
    this.Heights = [];
    this.ActiveFlag = false;
};

CImagesNum.prototype.clear = function()
{
    this.HideFlag = false;
    this.ImgsNum = 0;
    for(var i=0;i<this.Imgs.length;i++) {
        if (this.Imgs[i].Img != null) {
            this.Imgs[i].Img.kill();
            this.Imgs[i].Img = null;
        }
    }
};

CImagesNum.prototype.create = function(x,y,num,first,atlas,frames,group,
                                       align,lefts,shifts,marg,scale)
{
    this.clear();

    for(var i=0;i<frames.length;i++)
    {
        var frameData = this.Papa.cache.getFrameData(atlas);
        this.Widths[i] = frameData.getFrameByName(frames[i]).width;
        this.Heights[i] = frameData.getFrameByName(frames[i]).height;
    }

    this.FirstSymb = first;
   // this.ShiftX = sx;
   // this.ShiftY = sy;
    this.Lefts = lefts; // array of x shifts for one, two.. digits
    this.Frames = frames;
    this.Atlas = atlas;
    this.Align = align;
    this.Marg = marg;
    this.ScaleX = scale;
    this.ScaleY = scale;
    this.Group = group;
    this.Order = 0;
    this.Shifts = shifts;
    this.Group.alive = true;
    this.Group.visible = true;
    this.Group.scale.set(scale);
    this.setNum(num);
    this.Drag(x,y);
    this.ActiveFlag = true;
};

CImagesNum.prototype.Revive = function()
{
    this.setNum(this.Number);
};

CImagesNum.prototype.Hide = function(hide)
{
    if(hide)
    {
        this.Group.visible = false;
       // for(var i=0;i<this.SlotsNum;i++)
         //   this.Imgs[i].Img.visible = false;
    }
    else
    {
        this.Group.visible = true;
      //  for(i=0;i<this.SlotsNum;i++)
        //    this.Imgs[i].Img.visible = true;
    }
};

CImagesNum.prototype.setTint = function(tint)
{
     for(var i=0;i<this.SlotsNum;i++)
        this.Imgs[i].Img.tint = tint;
};


CImagesNum.prototype.addImgObj = function(sx,sy,num,slot)
{
    if(this.Imgs[slot]==undefined)
        this.Imgs[slot] = {Num:0,Sx0:0,Sy0:0,Sx:0,Sy:0,ScaleX:1,ScaleY:1,Img:null,HideFlag:false};

    if( this.Imgs[slot].Img==null)
    {
        // x,y,tex,frameName,group,order
        this.Imgs[slot].Img = this.Papa.getZeroImg(0,0,this.Atlas,this.Frames[num],this.Group,this.Order);
    }
    else
    {
        this.Imgs[slot].Img.x = 0;
        this.Imgs[slot].Img.y = 0;
        this.Imgs[slot].Img.frameName = this.Frames[num];
        this.Imgs[slot].Img.revive();
    }
    this.Imgs[slot].Img.x = sx;
    this.Imgs[slot].Img.y = sy;
    this.Imgs[slot].Num = num;
    this.Imgs[slot].Sx0 = sx;
    this.Imgs[slot].Sy0 = sy;
    this.Imgs[slot].Sx = sx;//*this.ScaleX;
    this.Imgs[slot].Sy = sy;//*this.ScaleY;
    this.Imgs[slot].HideFlag = false;
    return this.Imgs[slot];
};

CImagesNum.prototype.kill = function( )
{
    if(!this.ActiveFlag)  return;
    this.clear();
    this.Group.alive = false;
    this.ActiveFlag = false;
}

CImagesNum.prototype.DragUpdate = function()
{
    this.Drag(this.Xc,this.Yc);
};

CImagesNum.prototype.Drag = function(x,y)
{
    this.Xc = x;
    this.Yc = y;
    this.Group.x = this.Xc;
    this.Group.y = this.Yc;
   /* for(var i=0;i<this.SlotsNum;i++)
    {
        this.Imgs[i].Img.x =  this.Imgs[i].Sx;
        this.Imgs[i].Img.y =  this.Imgs[i].Sy;
    }*/
};

CImagesNum.prototype.setAlpha = function(alpha)
{
    this.Group.alpha = alpha;
   // for(var i=0;i<this.SlotsNum;i++)
    //    this.Imgs[i].Img.alpha = alpha;
};

CImagesNum.prototype.setScale = function(scalex,scaley)
{
    this.ScaleX = scalex;
    this.ScaleY = scaley;
    this.Group.scale.set(this.ScaleX,this.ScaleY);
  /*  for(var i=0;i<this.SlotsNum;i++)
    {
        this.Imgs[i].Sx = this.Imgs[i].Sx0*this.ScaleX;
        this.Imgs[i].Sy = this.Imgs[i].Sy0*this.ScaleY;
        this.Imgs[i].Img.x = this.Xc +  this.Imgs[i].Sx;
        this.Imgs[i].Img.y = this.Yc +  this.Imgs[i].Sy;
        this.Imgs[i].Img.scale.set(this.ScaleX,this.ScaleY);
    } */
};

CImagesNum.prototype.setNum = function(number)
{
    this.Number = number;
    var div = 1000000;
    var cntr = 7;
    var val = number;
    var num = 0;
    var flag = false;
    var w = 0;
    var slot = 0;
    var last = -1;
    var shift = 0;

    if(this.FirstSymb>=0 )  {
        num = this.FirstSymb;
        var pic =  this.addImgObj(w+shift,0,num,slot);
       // pic.Img.scale.setTo(this.ScaleX,this.ScaleY);
        pic.Img.anchor.set(0,0.5);
        pic.Img.alpha = 1;
        w += this.Widths[num] + this.Marg;
        pic.HideFlag = false;
        slot++;
    }

    while(cntr>0)
    {
        num =  Math.floor(val/div);

        if(flag)
        {
            //var pic = this.Base.MakeImg(this.Xc+w,this.Yc,atlas,names[num]);
            shift = 0; if(this.Shifts!=null && last>=0)  shift = this.Shifts[last][num];
            var pic =  this.addImgObj(w+shift,0,num,slot);
            //   pic.Sx = w; pic.Sy = 0;
          //  pic.Img.scale.setTo(this.ScaleX,this.ScaleY);
            pic.Img.anchor.set(0,0.5);
            pic.Img.alpha = 1;
            //  w += pic.Img.width + this.Marg + shift;
            w += this.Widths[num] + this.Marg + shift;
            pic.HideFlag = false;
            slot++;
        }
        else
        {
            if(num>0)
            {
                //  pic = this.Base.MakeImg(this.Xc+w,this.Yc,atlas,names[num]);
                shift = 0; if(this.Shifts!=null && last>=0)  shift = this.Shifts[last][num];
                pic =  this.addImgObj(w+shift,0,num,slot);
                //  pic.Sx = w; pic.Sy = 0;
              //  pic.Img.scale.setTo(this.ScaleX,this.ScaleY);
                pic.Img.anchor.set(0,0.5);
                pic.Img.alpha = 1;
                //w += pic.Img.width + this.Marg + shift;
                w += this.Widths[num] + this.Marg + shift;
                flag = true;
                pic.HideFlag = false;
                slot++;
            }
        }

        val -= num*div;
        div /= 10;
        cntr--;
        if(cntr<=0) {
            if(slot==0) {
                //pic = this.Base.MakeImg(this.Xc + w, this.Yc, atlas, names[0]);
                shift = 0; if(this.Shifts!=null && last>=0)  shift = this.Shifts[last][num];//*this.Scale;
                pic =  this.addImgObj(w+shift,0,0,slot);
                //  pic.Sx = w; pic.Sy = 0;
           //     pic.Img.scale.setTo(this.ScaleX,this.ScaleY);
                pic.Img.anchor.set(0,0.5);
                pic.Img.alpha = 1;
                w += this.Widths[num] + this.Marg + shift;
                // w += pic.Img.width + shift;
                pic.HideFlag = false;
                slot++;
            }
        }
        last = num;
    }

    this.SlotsNum = slot;

    // clear left imgs
    for(var i=slot;i<this.Imgs.length;i++) {
        if(this.Imgs[i].Img!=null)
        {
            this.Imgs[i].Img.visible = false;
            this.Imgs[i].HideFlag = true;
        }
    }

    switch(this.Align)
    {
        case 0: // center
            for(i=0;i<this.SlotsNum;i++) {
                this.Imgs[i].Sx0 -= w / 2;
                this.Imgs[i].Sy0 = 0;//this.Heights[this.Imgs[i].Num];

            }
            break;
        case 1: // left orient
            if(this.Lefts!=null)
            {
                for(i=0;i<this.SlotsNum;i++) {
                    this.Imgs[i].Sx0 -= this.Lefts[slot-1];
                }
            }
            break;
        case 2:
            if(this.SlotsNum==1)
            {
                for(i=0;i<this.SlotsNum;i++)
                    this.Imgs[i].Sx0 -= w/2;
            }
            else
            {
                if(this.Lefts!=null)
                {
                    for(i=0;i<this.SlotsNum;i++) {
                        this.Imgs[i].Sx0 -= this.Lefts[slot-1];
                    }
                }
            }
            break;
    }

     for(i=0;i<this.SlotsNum;i++) {
         this.Imgs[i].Sx = this.Imgs[i].Sx0;//*this.ScaleX;
         this.Imgs[i].Sy = this.Imgs[i].Sy0;//*this.ScaleY;
         this.Imgs[i].Img.x = this.Imgs[i].Sx;
         this.Imgs[i].Img.y = this.Imgs[i].Sy;
     }

    this.DragUpdate();
    return w;
};

//############################################
//############################################
//############################################



//#################################################
//#################################################
//#################################################

CExplGlow = function (papa,thread) {
    this.Papa = papa;
    this.Threads = thread;
    this.dT = 1.0/Base.UPS;//this.Papa.game.time.physicsElapsed;
    this.ActiveFlag = false;
};

CExplGlow.prototype.create = function(x,y,scale0,scale1,life,fade,alpha,atlas,imgStr,group)
{
    //clear
    this.dT = Base.RealTimeInt;
    if(this.dT<0.05) this.dT = 0.05;

    this.Angle = 0;

    this.Alpha = alpha;
    this.AlphaSpeedAddFade = this.dT*(this.Alpha)/fade;

    this.TimeLife = life;
    this.TimeCntr = 0;

    this.Scale = scale0;
    this.ScaleDest = scale1;
    this.ScaleAdd  =  (this.ScaleDest - this.Scale)*this.dT/(life+fade);

    this.X = x;
    this.Y = y;
    this.Img =  this.Papa.getImg(x,y,atlas,imgStr,group,0);
    this.Img.alpha = this.Alpha;
    this.Img.anchor.set( 0.5);
    this.Img.rotation = this.Angle;
    this.Img.scale.set(this.Scale);

    this.Threads.addThread(this,this.update);

    this.ActiveFlag = true;
};

CExplGlow.prototype.setAngle  = function(ang)
{
    this.Angle = ang;
    this.Img.rotation = this.Angle;
}

CExplGlow.prototype.setAnchor  = function(ax,ay) {
    this.Img.anchor.set(ax, ay);
}

CExplGlow.prototype.setScreenSplash  = function(x,y,w,h,life,fade,alpha,atlas,imgStr,group)
{
    this.ScaleAdd = 0;

    this.dT = Base.RealTimeInt;
    if(this.dT<0.05) this.dT = 0.05;

    this.Alpha = alpha;
    this.AlphaSpeedAddFade = this.dT*(this.Alpha)/fade;

    this.TimeLife = life;
    this.TimeCntr = 0;

    this.X = x;
    this.Y = y;
    this.Img =  this.Papa.getZeroImg(x,y,atlas,imgStr,group,0);// group.getFirstDead(false,x,y,'fx',imgStr);
    //this.Papa.getImg(x,y,group,null,order,Shifter.DustImgs[type]);
    //   this.Img.x = this.X;
    //  this.Img.y = this.Y;
    this.Img.alpha = this.Alpha;
    this.Img.anchor.set( 0.5);
    this.Img.width = w;
    this.Img.height = h;

    this.Threads.addThread(this,this.update);

    this.ActiveFlag = true;
};

CExplGlow.prototype.Kill = function()
{
    if(!this.ActiveFlag) return;
    this.Img.kill();
    this.Threads.removeThread(this,this.update);
    this.ActiveFlag = false;
};

CExplGlow.prototype.update = function()
{
    if(this.ScaleAdd!=0)
    {
        this.Scale +=  this.ScaleAdd;
        this.Img.scale.set(this.Scale);
    }

    if((this.TimeCntr += this.dT)>this.TimeLife)
    {
        this.Alpha -= this.AlphaSpeedAddFade;
        if(this.Alpha<0) {
             this.Kill();
             return;
        }
        this.Img.alpha = this.Alpha;
    }
};

//###############################################
//###############################################
//###############################################

CDustParticle = function (papa,thread) {
    this.Papa = papa;
    this.Threads = thread;
    this.dT = 1.0/Base.UPS;//this.Papa.game.time.physicsElapsed;
    this.ActiveFlag = false;
};

CDustParticle.prototype.create = function(x,y,type,time,speedx,speedy,group,alpha)
{
    //clear
    this.dT = Base.RealTimeInt;
    if(this.dT<0.05) this.dT = 0.05;
    this.Def = Base.Dusts[type];

    this.SpeedCoeffMin =  this.Def.speedMin;
    this.ScaleDie =  this.Def.scaleDie;
    this.Alpha = alpha;
    this.TimeLifeCntr = time;
    this.TimeFade = this.Def.timeFade;
    this.AlphaSpeedAddFade = (1.0/this.TimeFade)*this.dT;

    this.TimeCntr = 0;
    this.TimeCoeff = 0;

    //  this.TimeCntr += this.dT;
    this.SpeedCoeff = 1;
    this.SpeedCoeffSpeed = 1.0/(this.TimeFade+time);

    this.Duration = time;

    this.Scale =  this.Def.scale0 + this.Def.scaleRnd*Math.random();
    this.ScaleAdd  = this.dT*(1-this.ScaleDie)/this.TimeFade;

    this.X = x;
    this.Y = y;

    this.SpeedXAdd = speedx*this.dT;
    this.SpeedYAdd = speedy*this.dT;

    this.Img =  this.Papa.getImg(x,y,this.Def.atlas, this.Def.img,group,0);
    //this.Papa.getImg(x,y,group,null,order,Shifter.DustImgs[type]);
    this.Img.alpha = this.Alpha;
    this.Img.anchor.set(0.5);
    this.Img.scale.set(this.Scale);

    this.Threads.addThread(this,this.update);

    this.ActiveFlag = true;
};

CDustParticle.prototype.Kill = function()
{
    if(!this.ActiveFlag) return;
    this.Img.kill();
    this.Threads.removeThread(this,this.update);
    this.ActiveFlag = false;
};

CDustParticle.prototype.update = function()
{
    this.X +=  this.SpeedXAdd*this.SpeedCoeff;
    this.Y +=  this.SpeedYAdd*this.SpeedCoeff;
    this.Img.x = this.X;
    this.Img.y = this.Y;

    this.SpeedCoeff -= this.SpeedCoeffSpeed*Base.RealTimeInt;
    if( this.SpeedCoeff<0)  this.SpeedCoeff = 0;

    if((this.TimeLifeCntr -= this.dT)<0)
    {
        this.Scale -=  this.ScaleAdd;
        this.Img.scale.set(this.Scale);
        if(this.Scale<this.ScaleDie)
        {
            this.Kill();
        }
       // this.Alpha -=  this.AlphaSpeedAddFade;
       // if(this.Alpha<0)  this.Alpha = 0;
       // this.Img.alpha = this.Alpha;
    }
    else
    {
        /* this.Alpha +=  this.AlphaSpeedAdd;
         if(this.Alpha>this.AlphaDest)
         {
         this.Alpha = this.AlphaDest;
         this.Img.alpha = this.Alpha;
         }*/
    }
};

//######################################################
//######################################################
//######################################################

CExplParticle = function (papa,thread) {
    this.Papa = papa;
    this.Threads = thread;
    this.dT = 1.0/Base.UPS;//this.Papa.game.time.physicsElapsed;
    this.ActiveFlag = false;
};

CExplParticle.prototype.create = function(x,y,pic,type,life,speedx,speedy,ang,rot,group)
{
    //clear
    this.RotateSpeed = rot;
    this.Angle = ang;

    this.dT = Base.RealTimeInt;
    if(this.dT<0.05) this.dT = 0.05;
    this.Def = Base.Dusts[type];

    this.SpeedCoeffMin =  this.Def.speedMin;
    this.ScaleDie =  this.Def.scaleDie;
    this.Alpha = 1;
    this.TimeLifeCntr = life;
    this.TimeFade = this.Def.timeFade;
    this.AlphaSpeedAddFade = (1.0/this.TimeFade)*this.dT;

    this.TimeCntr = 0;
    this.TimeCoeff = 0;

    //  this.TimeCntr += this.dT;
    this.SpeedCoeff = 1;

    this.Duration = life +  this.TimeFade;

    this.Scale =  this.Def.scale0 + this.Def.scaleRnd*Math.random();
    this.ScaleAdd  = this.dT*(1-this.ScaleDie)/this.TimeFade;

    this.X = x;
    this.Y = y;

    this.SpeedXAdd = speedx*this.dT;
    this.SpeedYAdd = speedy*this.dT;

    this.SpeedGravity = 0;

    var imgStr = pic;
    if(pic==null) imgStr = this.Def.img;
    this.Img =  this.Papa.getImg(x,y, this.Def.atlas, imgStr,group,0);
    //this.Papa.getImg(x,y,group,null,order,Shifter.DustImgs[type]);
    //   this.Img.x = this.X;
    // this.Img.y = this.Y;
    this.Img.alpha = this.Alpha;
    this.Img.anchor.set(0.5);
    this.Img.rotation = ang;
    this.Img.scale.set(this.Scale);

    this.Threads.addThread(this,this.update);
    this.ActiveFlag = true;
};

CExplParticle.prototype.setGravity = function(speed)
{
    this.SpeedGravity = speed*this.dT;
};

CExplParticle.prototype.Kill = function()
{
    if(!this.ActiveFlag) return;
    this.Img.kill();
    this.Threads.removeThread(this,this.update);
    this.ActiveFlag = false;
};

CExplParticle.prototype.update = function()
{
    this.X +=  this.SpeedXAdd*this.SpeedCoeff;
    this.Y +=  this.SpeedYAdd*this.SpeedCoeff;
    this.Y += this.SpeedGravity;
    this.Img.x = this.X;
    this.Img.y = this.Y;
    if(this.RotateSpeed!=0)
    {
        this.Angle+= this.RotateSpeed*Base.RealTimeInt;
        this.Img.rotation = this.Angle;
    }

    //return k * ( 2 - k ); easing out

    var elapsed = this.TimeCntr / this.Duration;
    elapsed = elapsed > 1 ? 1 : elapsed;
    this.SpeedCoeff = elapsed*(2-elapsed);
    if(this.SpeedCoeff<this.SpeedCoeffMin) this.SpeedCoeff = this.SpeedCoeffMin;

    if((this.TimeLifeCntr -= this.dT)<0)
    {
        this.Scale -=  this.ScaleAdd;
        this.Img.scale.set(this.Scale);
        if(this.Scale<this.ScaleDie)
        {
            this.Kill();
        }
        // this.Alpha -=  this.AlphaSpeedAddFade;
        // if(this.Alpha<0)  this.Alpha = 0;
        //  this.Img.alpha = this.Alpha;
    }
    else
    {
        /* this.Alpha +=  this.AlphaSpeedAdd;
         if(this.Alpha>this.AlphaDest)
         {
         this.Alpha = this.AlphaDest;
         this.Img.alpha = this.Alpha;
         }*/
    }

};

//####################################
/*
CParticleRain = function (papa,threads) {
    this.Papa = papa;
    this.Threads = threads;
    this.ActiveFlag = false;
    this.Imgs = [];
};

CParticleRain.prototype.clear = function() {
    this.ImgsNum = 0;
    this.ActiveFlag = false;
    this.FadeFlag = false;
    this.GenFlag = false;
    this.AllDeadFlag = false;
};

CParticleRain.prototype.setXY = function(x,y,y_bott)
{
    this.Xc = x;
    this.Yc = y;
    this.Y_bott = y_bott;
};

CParticleRain.prototype.create = function(x,y,y_bott,def,width,stepx,stepxRnd,yRnd,
                                          time,delay,rate,group,onEnd,onEndContex) {
    this.clear();

    // {imgs:[],scale0:1,scaleRnd:0,speed:100,speedRnd:50,atlas:'atlas'}

    this.Xc = x;
    this.Yc = y;
    this.Type = type;
    this.Def = def;
    this.Group = group;

    this.Y_bott = y_bott;
    this.Width = width;

    this.OnEnd = onEnd;
    this.OnEndContex = onEndContex;

    this.StepX = stepx;
    this.StepXRnd = stepxRnd;
    this.StepsNum =  Math.floor(this.Width/ this.StepX);
    this.YRnd = yRnd;
    this.GenRate = rate;
    this.GenRateCntr = delay;

    this.TimeCntr = time + delay;

    this.PartTypeNum = this.Def.imgs.length;
    this.X0 = this.Xc -  (this.StepsNum-1)*this.StepX/2;

    this.Scale = this.Def.scale0;
    this.ScaleRnd = this.Def.scaleRnd;

    this.Speed = this.Def.speed ;
    this.SpeedRnd = this.Def.speedRnd;
    this.RotateSpeed = Math.PI*this.Def.rot/180;

    this.GenFlag = true;

    this.Threads.addThread(this,this.update);
    this.ActiveFlag = true;
};

CParticleRain.prototype.addParticle = function(x,y,frame,scale,ang) {

    var img = this.Papa.getZeroImg(x,y,this.Def.atlas,frame,this.Group,0);
    img.rotation = ang;
    img.Angle = ang;
    img.scale.set(scale);
    img.Yc =  y;
    img.Speed = this.Speed + this.SpeedRnd*Math.random();
    img.RotateSpeed = this.RotateSpeed;
    if(Math.random()<0.5)
        img.RotateSpeed = -this.RotateSpeed;
    img.Alpha = 1;

    for(var i=0;i<this.ImgsNum;i++)
    {
        if(this.Imgs[i]==null)
        {
            this.Imgs[i] = img;
            return img;
        }
    }

    this.Imgs[this.ImgsNum] = img;
    this.ImgsNum++;
    return img;
};

CParticleRain.prototype.kill = function() {
    if(!this.ActiveFlag) return;
    this.Threads.removeThread(this,this.update);
    this.ActiveFlag = false;
};

CParticleRain.prototype.setFade = function(time) {
    if(!this.ActiveFlag) return;
    this.FadeSpeed = 1/time;
    this.FadeFlag = true;
};

CParticleRain.prototype.updateFade = function() {

    if(this.AllDeadFlag)
    {
        this.kill();
        return;
    }

    this.AllDeadFlag = true;
    for(var i=0;i<this.ImgsNum;i++)
    {
        var img = this.Imgs[i];
        if(img!=null)
        {
            this.AllDeadFlag = false;
            img.Yc += img.Speed*Base.RealTimeInt;
            img.y = img.Yc;
            img.Angle += img.RotateSpeed*Base.RealTimeInt;
            img.rotation = img.Angle;
            img.Alpha -=  this.FadeSpeed*Base.RealTimeInt;
            if(img.Alpha<0)
            {
                img.kill();
                this.Imgs[i] = null;
            }
            else img.alpha = img.Alpha;
        }
    }
};

CParticleRain.prototype.update = function() {

    if(this.FadeFlag)
    {
        this.updateFade();
        return;
    }

    if(this.GenFlag)
    {
        this.TimeCntr -= Base.RealTimeInt;
        if(this.TimeCntr<0)
            this.GenFlag = false;

        this.GenRateCntr-=Base.RealTimeInt;
        if(this.GenRateCntr<=0) {
            this.GenRateCntr = this.GenRate;

            var x = this.X0;
            for(i=0;i<this.StepsNum;i++)
            {
                var type = Math.floor(this.PartTypeNum*Math.random());
                this.addParticle(x-this.StepXRnd/2+this.StepXRnd*Math.random(),
                    this.Yc + this.YRnd*Math.random(),this.Def.imgs[type],
                    this.Scale+this.ScaleRnd*Math.random(),Math.PI*Math.random());
                x += this.StepX;
            }
        }
    }
    else
    {
        if(this.AllDeadFlag)
        {
            this.kill();
            if(this.OnEnd!=null)
              this.OnEnd.call(this.OnEndContex);
            return;
        }
    }

    this.AllDeadFlag = true;
    for(var i=0;i<this.ImgsNum;i++)
    {
        var img = this.Imgs[i];
        if(img!=null)
        {
            this.AllDeadFlag = false;
            img.Yc += img.Speed*Base.RealTimeInt;
            img.y = img.Yc;
            img.Angle += img.RotateSpeed*Base.RealTimeInt;
            img.rotation = img.Angle;
            if(img.Yc>this.Y_bott)
            {
                img.kill();
                this.Imgs[i] = null;
            }
        }
    }
};
*/


//########################################################
CPopUp = function (papa,group,threads) {

    this.Papa = papa;
    this.Group = group;
    this.Threads = threads;
    this.AllParams = [];
    var params = {dist:50,life:1,rise:0.1,stay:0.75,fade:0.25}; // score up
    this.AllParams.push(params);
    params = {dist:50,life:1.5,rise:0.2,stay:1,fade:0.3}; // ghost
    this.AllParams.push(params);
};

CPopUp.prototype.clear = function()
{
    this.Alpha = 0;
    this.Scale = 1;
    this.Time = 0;
    this.TimeCoeff = 0;
    this.DistUp = 0;
    this.DistMaxDest = 0;
    this.DistMaxUpFlag = false;
    this.FadeFlag = false;
};

CPopUp.prototype.create = function(x,y,type,imgStr,pause,func,funcContex)
{
    this.clear();
    this.Type = type;
    this.Func = func;
    this.FuncContex = funcContex;
    this.Params =  this.AllParams[this.Type];
    this.PauseTimeCntr = pause;

    this.Y0 = y;
    this.Xc = x;
    this.Yc = y;
    this.Img = this.Papa.getImg(0,0,'atlas',imgStr,this.Group,0);
    this.Img.x = x;
    this.Img.y = this.Y0 - this.DistUp;
    this.Img.alpha = this.Alpha;
    this.Img.rotation = 0;
    this.Img.scale.set(this.Scale);
    this.Img.anchor.set(0.5);

    this.TimeDuration = this.Params.life;
    this.DistMax = this.Params.dist;

    this.AlphaSpeed = 1.0/this.Params.rise;
    this.updateAlpha = this.updateAlpha0;

    this.Threads.addThread(this,this.update);

    this.ActiveFlag = true;
};

CPopUp.prototype.setShortUp = function(add,time)
{
    if(this.DistMaxUpFlag) {
        this.DistMaxDest += add;
        return;
    }
    this.DistMaxDest = this.DistMax + add;
    this.DistMaxSpeed = (this.DistMaxDest-this.DistMax)/time;
    this.DistMaxUpFlag = true;
};

CPopUp.prototype.kill = function()
{
    if(!this.ActiveFlag) return;
    this.Threads.removeThread(this,this.update);
    this.Img.kill();
    this.ActiveFlag = false;
};

CPopUp.prototype.updateAlpha0 = function()
{
    this.Alpha += this.AlphaSpeed*Base.RealTimeInt;
    if(this.Alpha>=1)
    {
        this.Alpha = 1;
        this.StayTimeCntr = this.Params.stay;
        this.updateAlpha = this.updateAlpha1;
    }
    this.Img.alpha = this.Alpha;
};

CPopUp.prototype.updateAlpha1 = function()
{
    this.StayTimeCntr-=Base.RealTimeInt;
    if(this.StayTimeCntr<=0)
    {
        this.updateAlpha = this.updateAlpha2;
        this.AlphaSpeed = 1.0/this.Params.fade;
        this.FadeFlag = true;
    }
};

CPopUp.prototype.updateAlpha2 = function()
{
    this.Alpha -= this.AlphaSpeed*Base.RealTimeInt;
    if(this.Alpha<=0)
    {
        this.Alpha = 0;
        this.kill();
        if(this.Func!=null)  this.Func.call(this.FuncContex);
    }
    else
        this.Img.alpha = this.Alpha;
};

CPopUp.prototype.update = function()
{
    this.PauseTimeCntr-=Base.RealTimeInt;
    if(this.PauseTimeCntr>0) return;

    this.Time += Base.RealTimeInt;
    this.TimeCoeff =  this.Time/this.TimeDuration;
    this.TimeCoeff = this.TimeCoeff > 1 ? 1 : this.TimeCoeff;

    this.TimeCoeff = this.TimeCoeff * ( 2 - this.TimeCoeff);

    if(this.DistMaxUpFlag)
    {
        this.DistMax +=  this.DistMaxSpeed*Base.RealTimeInt;
        if( this.DistMax>=this.DistMaxDest)
        {
            this.DistMax = this.DistMaxDest;
            this.DistMaxUpFlag = false;
        }
    }

    this.DistUp = this.DistMax*this.TimeCoeff;
    this.Yc = this.Y0 - this.DistUp;
    this.Img.y =  this.Yc;

    this.updateAlpha.call(this);
};

//####################################################################
//####################################################################
//####################################################################

CImgGroup = function (game,papa,threads) {

    Phaser.Group.call(this,game,null);

    this.Papa = papa; // CGame
    this.x = 0;
    this.y = 0;
    this.game = game;
    this.Imgs = [];
    this.ImgsNum = 0;

    this.Threads = threads;
    this.ActiveFlag = false;

};

CImgGroup.prototype = Object.create(Phaser.Group.prototype);
CImgGroup.prototype.constructor = CImgGroup;

CImgGroup.prototype.clear = function() {
    this.ScalingFlag = false;
    this.Scale = 1;
    this.ImgsNum = 0;
};

CImgGroup.prototype.create = function(x,y,dy,ang,scale) {

    this.clear();
    this.x = x;
    this.y = y;
    this.angle = ang;
    this.rotation = ang;
    this.Scale = scale;
    this.scale.set(scale);

    this.ActiveFlag = true;
};

CImgGroup.prototype.setAngle = function(ang)
{
    this.angle = ang;
    this.rotation = ang;
    this.update();
};

CImgGroup.prototype.addImgObj = function(x,y,tex,frameName,order,scale,ang)
{
    var img = this.addImg(x,y,tex,frameName,order);

    img.anchor.set(0.5);
    img.alpha = 1;

    var slot = this.ImgsNum;
    if(this.Imgs[slot]==undefined)
        this.Imgs[slot] = {Sx:0,Sy:0,Scale:scale,Img:null};

    this.Imgs[slot].Img = img;
    this.Imgs[slot].Sx = x;
    this.Imgs[slot].Sy = y;
    this.Imgs[slot].Scale = scale;
    this.Imgs[slot].Angle = ang;

    this.Imgs[slot].Img.scale.set(this.Imgs[slot].Scale);
    this.Imgs[slot].Img.rotation =  this.Imgs[slot].Angle;

    this.ImgsNum++;
    return this.Imgs[slot];
};

CImgGroup.prototype.setScale = function(scale) {

    this.Scale = scale;
    this.scale.set(this.Scale);

    /*  this.Number.setScale(this.NumberScale*this.Scale,this.NumberScale*this.Scale);

     for(var i=0;i<this.ImgsNum;i++)
     this.Imgs[i].Img.scale.set( this.Imgs[i].Scale*this.Scale);*/
};

CImgGroup.prototype.setScaling = function(dest,time,hide) {

    this.ScaleDest = dest;
    this.ScaleSpeed = (this.ScaleDest-this.Scale)/time;
    this.ScalingHideFlag = hide;
    if(this.ScalingFlag==false)  this.Threads.addThread(this,this.scalingUpdate);
    this.ScalingFlag = true;
};

CImgGroup.prototype.scalingUpdate = function() {
    if(this.ScalingFlag)
    {
        this.Scale += this.ScaleSpeed*Backet.RealTimeInt;
        if((this.Scale>this.ScaleDest && this.ScaleSpeed>0) ||
            (this.Scale<this.ScaleDest && this.ScaleSpeed<0))
        {
            this.Scale = this.ScaleDest;
            if(this.ScalingHideFlag)
                this.Hide(true);
            this.ScalingFlag = false;
            this.Threads.removeThread(this,this.scalingUpdate);
        }
        this.setScale(this.Scale);
    }
};

CImgGroup.prototype.kill = function() {
    if(!this.ActiveFlag)  return;

    for (var i = 0; i < this.children.length; i++)
    {
        if (this.children[i].alive)
            this.children[i].kill();
    }
    if(this.ScalingFlag)
        this.Threads.removeThread(this,this.scalingUpdate);
    this.ImgsNum = 0;
    this.ActiveFlag = true;
};

CImgGroup.prototype.Hide = function(hide) {
    this.Number.Hide(hide);
    if(hide)
    {
        for (var i = 0; i < this.children.length; i++)
        {
            if (this.children[i].visible)
                this.children[i].visible = false;
        }
    }
    else
    {
        for (i = 0; i < this.children.length; i++)
        {
            if (this.children[i].alive)
                this.children[i].visible = true;
        }
    }
};


CImgGroup.prototype.addImg = function(x,y,tex,frameName) {
    var img = null;
    for (var i = 0; i < this.children.length; i++)
    {
        if (this.children[i].alive === false &&
            (this.children[i] instanceof Phaser.Image) &&
            (this.children[i].type==Phaser.IMAGE) &&
            (this.children[i].key===tex))
        {
            img = this.children[i];
            break;
        }
    }

    if (img == null) {
        img = this.game.make.image(x, y, tex, frameName);
        this.add(img);
    }
    else {
        img.revive();
        img.x = x;
        img.y = y;
        if(frameName!=null)
            img.frameName = frameName;
    }

    img.Order = 0;
    //  group.sort('Order',-1);
    return img;
};


//#####################################################################
//#####################################################################


//########################################################
CTextPopUp = function (papa,group,threads) {

    this.Papa = papa;
    this.Group = group;
    this.Threads = threads;
    this.AllParams = [];
    this.AllParams.push({dist:40,rise:0.1,stay:0.25,fade:0.25});
    this.AllParams.push({dist:30,rise:0.1,stay:1,fade:0.3});
};

CTextPopUp.prototype.clear = function()
{
    this.Alpha = 0;
    this.Scale = 1;
    this.Time = 0;
    this.TimeCoeff = 0;
    this.DistUp = 0;
    this.DistMaxDest = 0;
    this.DistMaxUpFlag = false;
    this.FadeFlag = false;
};

CTextPopUp.prototype.init = function(text)
{
    this.Text = text;
    this.Text.visible = false;
    this.Text.alive = false;
};

CTextPopUp.prototype.create = function(x,y,type,str,scale,w_max)
{
    this.clear();
    this.Type = type;
   // this.Func = func;
   // this.FuncContex = funcContex;
    this.Params =  this.AllParams[this.Type];
    this.PauseTimeCntr = 0;

    this.Y0 = y;
    this.Xc = x;
    this.Yc = y;
    this.Text.x = x;
    this.Text.y = this.Y0 - this.DistUp;
    this.Text.alpha = this.Alpha;
    this.Text.rotation = 0;
    this.Scale = scale;
    this.Text.scale.set(this.Scale);
    this.Text.anchor.set(0.5);
    this.Text.visible = true;
    this.Text.alive = true;
    this.Text.setText(str);
    if(w_max>0) this.setWidthMax(w_max);

    this.TimeDuration = this.Params.rise + this.Params.stay + this.Params.fade;
    this.DistMax = this.Params.dist;

    this.AlphaSpeed = 1.0/this.Params.rise;
    this.updateAlpha = this.updateAlpha0;

    if(!this.ActiveFlag )
    this.Threads.addThread(this,this.update);

    this.ActiveFlag = true;
};

CTextPopUp.prototype.setWidthMax = function(w_max)
{
    var w = this.Text.width;
    if(w>w_max) this.Scale = w_max/w;
    this.Text.scale.set(this.Scale);
};

CTextPopUp.prototype.setShortUp = function(add,time)
{
    if(this.DistMaxUpFlag) {
        this.DistMaxDest += add;
        return;
    }
    this.DistMaxDest = this.DistMax + add;
    this.DistMaxSpeed = (this.DistMaxDest-this.DistMax)/time;
    this.DistMaxUpFlag = true;
};

CTextPopUp.prototype.kill = function()
{
    if(!this.ActiveFlag) return;
    this.Threads.removeThread(this,this.update);
    this.Text.visible = false;
    this.Text.alive = false;
    this.ActiveFlag = false;
};

CTextPopUp.prototype.updateAlpha0 = function()
{
    this.Alpha += this.AlphaSpeed*Base.RealTimeInt;
    if(this.Alpha>=1)
    {
        this.Alpha = 1;
        this.StayTimeCntr = this.Params.stay;
        this.updateAlpha = this.updateAlpha1;
    }
    this.Text.alpha = this.Alpha;
};

CTextPopUp.prototype.updateAlpha1 = function()
{
    this.StayTimeCntr-=Base.RealTimeInt;
    if(this.StayTimeCntr<=0)
    {
        this.updateAlpha = this.updateAlpha2;
        this.AlphaSpeed = 1.0/this.Params.fade;
        this.FadeFlag = true;
    }
};

CTextPopUp.prototype.updateAlpha2 = function()
{
    this.Alpha -= this.AlphaSpeed*Base.RealTimeInt;
    if(this.Alpha<=0)
    {
        this.Alpha = 0;
        this.kill();
     //   if(this.Func!=null)  this.Func.call(this.FuncContex);
    }
    else
        this.Text.alpha = this.Alpha;
};

CTextPopUp.prototype.update = function()
{
    this.PauseTimeCntr-=Base.RealTimeInt;
    if(this.PauseTimeCntr>0) return;

    this.Time += Base.RealTimeInt;
    this.TimeCoeff =  this.Time/this.TimeDuration;
    this.TimeCoeff = this.TimeCoeff > 1 ? 1 : this.TimeCoeff;

    this.TimeCoeff = this.TimeCoeff * ( 2 - this.TimeCoeff);

    if(this.DistMaxUpFlag)
    {
        this.DistMax +=  this.DistMaxSpeed*Base.RealTimeInt;
        if( this.DistMax>=this.DistMaxDest)
        {
            this.DistMax = this.DistMaxDest;
            this.DistMaxUpFlag = false;
        }
    }

    this.DistUp = this.DistMax*this.TimeCoeff;
    this.Yc = this.Y0 - this.DistUp;
    this.Text.y =  this.Yc;

    this.updateAlpha.call(this);
};

//#####################################################################
//#####################################################################
//#####################################################################

CPopNum = function (papa,group,threads) {

    this.Papa = papa;
    this.Group = group;
    this.Threads = threads;
    this.AllParams = [];
    var params = {dist:50,life:0.6,rise:0.1,stay:0.5,fade:0.25,marg:1}; // score up
    this.AllParams.push(params);
    this.Number = new CImagesNum(this.Papa);
    this.GroupNum = this.Papa.game.add.group();
    this.Group.add(this.GroupNum);
};

CPopNum.prototype.clear = function()
{
    this.Alpha = 0;
    this.Scale = 1;
    this.Time = 0;
    this.TimeCoeff = 0;
    this.DistUp = 0;
    this.DistMaxDest = 0;
    this.DistMaxUpFlag = false;
    this.FadeFlag = false;
    this.Number.clear();
    this.Row = 0;
    this.Col = 0;
};

CPopNum.prototype.create = function(x,y,type,num,alpha,tint,pause,scale,func,funcContex)
{
    this.clear();
    this.Type = type;
    this.Func = func;
    this.FuncContex = funcContex;
    this.Params =  this.AllParams[this.Type];
    this.PauseTimeCntr = pause;

    this.Y0 = y;
    this.Xc = x;
    this.Yc = y;

    //x,y,num,first,atlas,frames,group,
     //   align,lefts,shifts,marg,scale)

    this.Number.create(x,y,num,10,'atlas',Base.WhiteNums,this.GroupNum,0,
                       null,null,this.Params.marg,scale);
    this.Number.setAlpha(alpha);
    this.Number.setTint(tint);

    this.TimeDuration = this.Params.life;
    this.DistMax = this.Params.dist;

    this.AlphaMax = alpha;
    this.AlphaSpeed = this.AlphaMax/this.Params.rise;
    this.updateAlpha = this.updateAlpha0;

    this.Threads.addThread(this,this.update);

    this.ActiveFlag = true;
};

CPopNum.prototype.setNumber = function(num)
{
    this.Number.setNum(num);
};

CPopNum.prototype.setRowCol = function(row,col)
{
    this.Row = row;
    this.Col = col;
};

CPopNum.prototype.setShortUp = function(add,time)
{
    if(this.DistMaxUpFlag) {
        this.DistMaxDest += add;
        return;
    }
    this.DistMaxDest = this.DistMax + add;
    this.DistMaxSpeed = (this.DistMaxDest-this.DistMax)/time;
    this.DistMaxUpFlag = true;
};

CPopNum.prototype.kill = function()
{
    if(!this.ActiveFlag) return;
    this.Threads.removeThread(this,this.update);
    this.Number.kill();
    this.ActiveFlag = false;
};

CPopNum.prototype.updateAlpha0 = function()
{
    this.Alpha += this.AlphaSpeed*Base.RealTimeInt;
    if(this.Alpha>=this.AlphaMax)
    {
        this.Alpha = this.AlphaMax;
        this.StayTimeCntr = this.Params.stay;
        this.updateAlpha = this.updateAlpha1;
    }
    this.Number.setAlpha(this.Alpha);
};

CPopNum.prototype.updateAlpha1 = function()
{
    this.StayTimeCntr-=Base.RealTimeInt;
    if(this.StayTimeCntr<=0)
    {
        this.updateAlpha = this.updateAlpha2;
        this.AlphaSpeed = 1.0/this.Params.fade;
        this.FadeFlag = true;
    }
};

CPopNum.prototype.updateAlpha2 = function()
{
    this.Alpha -= this.AlphaSpeed*Base.RealTimeInt;
    if(this.Alpha<=0)
    {
        this.Alpha = 0;
        this.kill();
        if(this.Func!=null)  this.Func.call(this.FuncContex);
    }
    else
        this.Number.setAlpha(this.Alpha);
};

CPopNum.prototype.update = function()
{
    this.PauseTimeCntr-=Base.RealTimeInt;
    if(this.PauseTimeCntr>0) return;

    this.Time += Base.RealTimeInt;
    this.TimeCoeff =  this.Time/this.TimeDuration;
    if(this.TimeCoeff>1) this.TimeCoeff = 1;
    //this.TimeCoeff = this.TimeCoeff > 1 ? 1 : this.TimeCoeff;
  //  this.TimeCoeff = this.TimeCoeff * ( 1 - this.TimeCoeff);
    this.TimeCoeff =  --this.TimeCoeff*this.TimeCoeff*this.TimeCoeff + 1;
//--k * k * k   +  1;
  /*  if(this.DistMaxUpFlag)
    {
        this.DistMax +=  this.DistMaxSpeed*Base.RealTimeInt;
        if( this.DistMax>=this.DistMaxDest)
        {
            this.DistMax = this.DistMaxDest;
            this.DistMaxUpFlag = false;
        }
    } */

    this.DistUp = this.DistMax*this.TimeCoeff;
    this.Yc = this.Y0 + this.DistUp;
    this.Number.Drag(this.Xc,this.Yc);

    this.updateAlpha.call(this);
};

//####################################################################

CFishAnimFX = function (papa,group,threads) {

    this.Papa = papa;
    this.Group = group;
    this.Threads = threads;
    this.ActiveFlag = false;
};


CFishAnimFX.prototype.create = function(x,y,time,base,type,func,funcContex)
{
    this.X0 = x;
    this.Y0 = y;
    this.Scale = 1;
    this.Base = base;
    this.Xc =  this.X0;
    this.Yc = this.Base.y + this.Y0;
    this.ImgStrs = Base.FXAnims[type].imgs;
    this.ShiftX = Base.FXAnims[type].sx;
    this.ShiftY = Base.FXAnims[type].sy;
    this.Func = func;
    this.FuncContex = funcContex;

    this.Img = this.Papa.getZeroImg(this.Xc+this.ShiftX ,
        this.Yc+this.ShiftY,'gfx',this.ImgStrs[0],this.Group,0);
    this.Img.x = this.Xc;
    this.Img.y = this.Yc;
    this.Img.scale.set(this.Scale);

    this.TimeCntr = 0;
    this.Time = time;//this.ImgStrs.length*(1/30);//time;

    this.Threads.addThread(this,this.update);
    this.ActiveFlag = true;
};

CFishAnimFX.prototype.kill = function()
{
    if(!this.ActiveFlag)  return;
    this.Img.kill();
    this.Threads.removeThread(this,this.update);
    this.ActiveFlag = false;
    if(this.Func!=null)
        this.Func.call(this.FuncContex);
};

CFishAnimFX.prototype.update = function()
{
    this.Xc =  this.X0 + this.ShiftX;
    this.Yc = this.Base.y + this.Y0 + this.ShiftY;
    this.Img.x = this.Xc;
    this.Img.y = this.Yc;

    this.TimeCntr += Base.RealTimeInt;
    var frame = Math.floor(this.TimeCntr*this.ImgStrs.length/this.Time);
    if(frame>=this.ImgStrs.length) {
        this.kill();
        return;
    }

    this.Img.frameName = this.ImgStrs[frame];
};


//####################################################################
//####################################################################
//####################################################################

/*
CFishFX = function (papa,group,threads) {

    this.Papa = papa;
    this.Group = group;
    this.Threads = threads;
    this.ActiveFlag = false;
};

CFishFX.prototype.create = function(x,y,base,type)
{
    this.X0 = x;
    this.Y0 = y;
    this.Base = base;
    this.Xc =  this.X0;
    this.Yc = this.Base.y + this.Y0;
    this.GlowImg0 = this.Papa.getZeroImg(this.Xc,this.Yc,'atlas','ring.png',this.Group,0);
    this.GlowImg1 = this.Papa.getZeroImg(this.Xc,this.Yc,'atlas','ring1.png',this.Group,0);

    this.Alpha0 = 0.6;
  //  this.Alpha =  this.Alpha0;
  //  this.AlphaSpeed = - this.Alpha*5;

    this.Scale0 = 1.1;
    this.Scale1 = 1;
    this.GlowImg0.scale.set(this.Scale0);
    this.GlowImg1.scale.set(this.Scale1);
    this.ScaleSpeed0 = -0.5*3;
    this.ScaleSpeed1 = 2;

    this.TimeLife = 0.3;
    this.TimeLifeCntr = 0;
    this.Coeff = 1;

    this.Threads.addThread(this,this.update);
    this.ActiveFlag = true;
};

CFishFX.prototype.kill = function()
{
    if(!this.ActiveFlag)  return;
    this.GlowImg0.kill();
    this.GlowImg1.kill();
    this.Threads.removeThread(this,this.update);
    this.ActiveFlag = false;
};

CFishFX.prototype.update = function()
{
    this.Xc =  this.X0;
    this.Yc = this.Base.y + this.Y0;
    this.GlowImg0.x = this.Xc;
    this.GlowImg0.y = this.Yc;
    this.GlowImg1.x = this.Xc;
    this.GlowImg1.y = this.Yc;


    this.Coeff = 1 - this.TimeLifeCntr/this.TimeLife;
    this.TimeLifeCntr += Base.RealTimeInt;

    if(this.TimeLifeCntr>=this.TimeLife) {
        this.Alpha = 0;
        this.kill();
        return;
    }

    this.GlowImg0.alpha = this.Alpha0*this.Coeff*this.Coeff;
    this.GlowImg1.alpha = this.Alpha0*this.Coeff*this.Coeff;

    this.Scale0 += this.ScaleSpeed0*Base.RealTimeInt;
    this.Scale1 += this.ScaleSpeed1*Base.RealTimeInt;
    this.GlowImg0.scale.set(this.Scale0);
    this.GlowImg1.scale.set(this.Scale1*this.Scale1);
}; */

//################################################################################
//################################################################################
//################################################################################

CFrenzy = function (papa,group,threads) {

    this.Papa = papa;
    this.Group = group;
    this.Threads = threads;
    this.ActiveFlag = false;

    this.Lights = [];
    this.LightsNum = 0;

    this.Lines = [];
    this.LinesNum = 0;

    this.ActiveFlag = false;
};

CFrenzy.prototype.init = function(slider,sliderBg,bg,panel,text)
{
    this.BgFreenzyImg = bg;
    this.BgFreenzyImg.visible = false;

    this.FreenzySliderBgImg = sliderBg;
    this.FreenzySliderBgImg.anchor.set(0.5,0.5);
    this.FreenzySliderBgImg.visible = false;

    this.FreenzySliderImg = slider;
    this.FreenzySliderImg.visible = false;
    this.FreenzySliderImg.x = Base.Width/2 - this.FreenzySliderImg.width/2;
    this.FreenzySliderImg.anchor.set(0,0.5);
    this.FreenzySliderImg.cropRect =  new Phaser.Rectangle(0,0,
        this.FreenzySliderImg.width,this.FreenzySliderImg.height);
    this.FreenzySliderWidth = this.FreenzySliderImg.width;

    this.FreenzyPanelImg = panel;
    this.FreenzyText = text;
    this.FreenzyPanelImg.visible = false;
    this.FreenzyText.visible = false;

    this.Y_text = 50 + Base.LangParams[Base.LangIndex].y_frenzy;

    this.ActiveFlag = false;
};

CFrenzy.prototype.create = function(xc)
{
    this.FreenzyTime = 5;
    this.FreenzyTimeCntr = this.FreenzyTime;

    this.FreenzySliderBgImg.visible = true;
    this.FreenzySliderImg.visible = true;
    this.BgFreenzyImg.visible = true;
    this.FreenzySliderBgImg.alpha = 0;
    this.FreenzySliderImg.alpha = 0;
    this.BgFreenzyImg.alpha = 0;
    this.FreenzySliderImg.cropRect.width = this.FreenzySliderWidth;
    this.FreenzySliderImg.updateCrop();

   // this.LevelThreads.addThread(this,this.updateFreenzy);

    this.Alpha = 0;
    this.AlphaSpeed = 2;
    this.Threads.addThread(this,this.updateFadeIn);

    var stepy = 90;
    this.LightsNum = 0;
    for(var i=0;i<6;i++) {
        if(this.Lights[this.LightsNum] ==undefined)
            this.Lights[this.LightsNum] = {img:null,frame:0};
        var obj = this.Lights[this.LightsNum];
        this.LightsNum++;
        obj.img = this.Papa.getZeroImg(xc-295,180+stepy*i,'gfx','light_00.png',this.Group);
        obj.img.alpha = 0;
        obj.rateCntr = 1 + i*0.3;
        obj.frame = 0;
        obj.alpha = -(i*0.35+0.25);

        if(this.Lights[this.LightsNum] ==undefined)
            this.Lights[this.LightsNum] = {img:null};
        obj = this.Lights[this.LightsNum];
        this.LightsNum++;
        obj.img = this.Papa.getZeroImg(xc+290,180+stepy*i,'gfx','light_00.png',this.Group);
        obj.img.anchor.set(0.5);
        obj.img.alpha = 0;
    }
    this.Threads.addThread(this,this.updateLightsFadeIn);

    //101,104
    this.LinesNum = 0;
    for( i=0;i<this.Papa.LinesXY.length;i++) {
        if(this.Lines[this.LinesNum] ==undefined)
            this.Lines[this.LinesNum] = {img:null,alpha:0};
        obj = this.Lines[this.LinesNum];
        this.LinesNum++;
        obj.img = this.Papa.getZeroImg(this.Papa.LinesXY[i].x-101,
            this.Papa.LinesXY[i].y-104,'gfx','lineGlow1.png',this.Group);
        obj.img.anchor.set(0,0);
        obj.img.alpha = 0;
        obj.alpha = 0;//-(1.5 + i*0.3);
    }
    for( i=0;i<this.Papa.LinesXY.length/2;i++) {
        this.Lines[i].alpha = -(i*0.75);
        this.Lines[this.Papa.LinesXY.length-1-i].alpha =  -(i*0.75);
    }
    this.LinesFadeInTimeCntr = 1;


    this.FreenzyPanelImg.visible = true;
    this.FreenzyText.visible = true;
    this.FreenzyPanelImg.y = 0;
    this.FreenzyText.y = 40;
    this.FreenzyText.anchor.set(0.5,0.5);
    this.FreenzyText.setText(sgLang.x3[Base.Lang]);
    this.FreenzyText.update();

    /*if(this.FreenzyText.height>40) {
        this.FreenzyText.scale.set(40 / this.FreenzyText.height);
        this.FreenzyText.update();
    }*/

    if(this.FreenzyText.width>210)
        this.FreenzyText.scale.set(210/this.FreenzyText.width);
    else {
     //   if(this.FreenzyText.height>50)
        //    this.FreenzyText.scale.set(50 / this.FreenzyText.height);
    }

    this.Y0_pad = 0;
    this.Y_pad = 0;
    this.DistPad = 100;
    this.DistYoYo = 20;
    this.DistTime = 0.5;
    this.TimeYoYo = 0.2;
    this.DistTimeCntr = 0;
    this.PadYoYoCntr = 0;
    this.PadMoveFlag = true;
    this.Threads.addThread(this,this.updatePad);

    this.Threads.addThread(this,this.updateFreenzy);

    this.FadeFlag = false;
    this.ActiveFlag = true;
};

CFrenzy.prototype.stop = function() {
    // call outside to stop it now
    if(this.FadeFlag) return;
    this.FadeFreenzy();
};

CFrenzy.prototype.updateFreenzy = function() {
    this.FreenzyTimeCntr -= Base.RealTimeInt;
    if(this.FreenzyTimeCntr<=0) {
        this.stop();
    }
    else {
        this.setFreenzySlider(this.FreenzyTimeCntr/this.FreenzyTime);
    }
};

CFrenzy.prototype.setPadOut = function() {
    this.Y0_pad = this.FreenzyPanelImg.y;
    this.DistPad = 15;
    this.DistYoYo = 120;
    this.DistTime = 0.25;
    this.TimeYoYo = 0.7;
    this.DistTimeCntr = 0;
    this.PadYoYoCntr = 0;
    this.Threads.addThread(this,this.updatePadOut);
};

CFrenzy.prototype.updatePadOut = function() {
    this.DistTimeCntr += Base.RealTimeInt;
    var coeff = this.DistTimeCntr/this.DistTime;
    if ((coeff *= 2) < 1) {
        coeff = 0.5 * coeff * coeff;
    } else
        coeff = - 0.5 * (--coeff * (coeff - 2) - 1);
    if(this.DistTimeCntr>=this.DistTime)  coeff = 1;
    this.Y_pad = this.Y0_pad + this.DistPad*coeff;
    this.FreenzyPanelImg.y = this.Y_pad;
    this.FreenzyText.y = this.Y_pad + this.Y_text;
    if(coeff==1) {

        this.Y0_pad = this.Y_pad;
        if(this.PadYoYoCntr==0) {
            this.DistPad = -this.DistYoYo;
            this.DistTime = this.TimeYoYo;
        } else {
            this.Threads.removeThread(this,this.updatePadOut);
            return;
        }
        this.PadYoYoCntr++;
    }
};

CFrenzy.prototype.updatePad = function() {
    this.DistTimeCntr += Base.RealTimeInt;
    var coeff = this.DistTimeCntr/this.DistTime;
   // coeff = --coeff * coeff * coeff   +  1;
 //   coeff = coeff * ( 2 - coeff);

    if ((coeff *= 2) < 1) {
        coeff = 0.5 * coeff * coeff;
    } else
        coeff = - 0.5 * (--coeff * (coeff - 2) - 1);


    if(this.DistTimeCntr>=this.DistTime)  coeff = 1;
    this.Y_pad = this.Y0_pad + this.DistPad*coeff;
    this.FreenzyPanelImg.y = this.Y_pad;
    this.FreenzyText.y = this.Y_pad + this.Y_text;
    if(coeff==1) {

        this.Y0_pad = this.Y_pad;
        if(this.PadYoYoCntr==0) {
            this.DistPad = -this.DistYoYo;
            this.DistTime = this.TimeYoYo;
        } else {
            this.DistPad = -this.DistPad*0.8;
            this.TimeYoYo = this.TimeYoYo*0.9;
            this.DistTime = this.TimeYoYo;
        }
    //   console.log("DistPad "+this.DistPad);
     //  console.log("DistTime "+this.DistTime);
        this.PadYoYoCntr++;
        this.DistTimeCntr = 0;
        if(Math.abs(this.DistPad)<3) {
            this.PadMoveFlag = false;
            this.Threads.removeThread(this,this.updatePad);
           // console.log("PadYoYoCntr "+this.PadYoYoCntr);
        }
    }
};

CFrenzy.prototype.FadeFreenzy = function() { // call to end the mode
    this.AlphaSpeed = -1.5;
    // this.Y0_pad = this.Y_pad;
 //   this.DistPad = -105;
  //  this.Y0_pad = this.FreenzyPanelImg.y;
    this.Threads.addThread(this,this.updateFadeOut);
    this.Threads.removeThread(this,this.updateFreenzy);
    this.Papa.Field.OffFreenzy();
    this.setPadOut();
    this.FadeFlag = true;
};

CFrenzy.prototype.updateLightsFadeIn = function() {
    for(var i=0;i<this.LightsNum-1;i+=2) {
        this.Lights[i].alpha  += 3*Base.RealTimeInt;
        if(this.Lights[i].alpha>=0) {
            if(this.Lights[i].alpha>=1) {
                this.Lights[i].alpha = 1;
                if((i+1)==(this.LightsNum-1)) {
                    this.Threads.removeThread(this,this.updateLightsFadeIn);
                }
            }
            this.Lights[i].img.alpha = this.Lights[i].alpha;
            this.Lights[i+1].img.alpha = this.Lights[i].alpha;
        }
    }
};

CFrenzy.prototype.updateLines = function() {
    this.LinesFadeInTimeCntr-=Base.RealTimeInt;
    for(var i=0;i<this.LinesNum;i++) {
        this.Lines[i].alpha += 2*Base.RealTimeInt;
        if(this.Lines[i].alpha>=0) {
            if(this.Lines[i].alpha>=1) {
                this.Lines[i].alpha = 1;
            } else this.Lines[i].img.alpha =  this.Lines[i].alpha;
        }
    }

    if( this.LinesFadeInTimeCntr<0)
        this.Threads.removeThread(this,this.updateLines);
};

CFrenzy.prototype.updateLight = function() {
    for(var i=0;i<this.LightsNum-1;i+=2) {
        this.Lights[i].rateCntr -= Base.RealTimeInt;
        if(this.Lights[i].rateCntr<=0) {
            this.Lights[i].rateCntr = 1/30;
            this.Lights[i].frame++;
            if(this.Lights[i].frame>=Base.Lights.length)
                this.Lights[i].frame = 0;
            this.Lights[i].img.frameName = Base.Lights[this.Lights[i].frame];
            this.Lights[i+1].img.frameName = Base.Lights[this.Lights[i].frame];
        }
    }
};

CFrenzy.prototype.setFreenzySlider = function(coeff)
{
    this.FreenzySliderImg.cropRect.width = this.FreenzySliderWidth*coeff;
    this.FreenzySliderImg.updateCrop();
};

CFrenzy.prototype.updateFadeIn = function()
{
    this.Alpha += this.AlphaSpeed*Base.RealTimeInt;
    if(this.Alpha>=1) {
        this.Alpha = 1;
        this.Threads.removeThread(this,this.updateFadeIn);
        this.Threads.addThread(this,this.updateLight);
        this.Threads.addThread(this,this.updateLines);
    }
  //  for(var i=0;i<this.LightsNum;i++)
   //     this.Lights[i].img.alpha = this.Alpha;

    this.FreenzySliderBgImg.alpha = this.Alpha;
    this.FreenzySliderImg.alpha = this.Alpha;
    this.BgFreenzyImg.alpha = this.Alpha;
};

CFrenzy.prototype.updateFadeOut= function()
{
    this.Alpha += this.AlphaSpeed*Base.RealTimeInt;
    if(this.Alpha<=0) {
        this.Alpha = 0;
        this.kill();
        return;
    }
    for(var i=0;i<this.LightsNum;i++)
        this.Lights[i].img.alpha = this.Alpha;

    for(i=0;i<this.LinesNum;i++)
        this.Lines[i].img.alpha = this.Alpha;

    //k * ( 2 - k )
  //  this.FreenzyPanelImg.y = this.Y0_pad + (1-this.Alpha*this.Alpha)*this.DistPad;
  //  this.FreenzyText.y = this.FreenzyPanelImg.y + 40;

    this.FreenzySliderBgImg.alpha = this.Alpha;
    this.FreenzySliderImg.alpha = this.Alpha;
    this.BgFreenzyImg.alpha = this.Alpha;
};

CFrenzy.prototype.kill = function()
{
    if(!this.ActiveFlag)  return;

    if(this.PadMoveFlag)
        this.Threads.removeThread(this,this.updatePad);
    this.Threads.removeThread(this,this.updatePadOut);
    this.Threads.removeThread(this,this.updateLightsFadeIn);
    this.Threads.removeThread(this,this.updateLines);
    this.Threads.removeThread(this,this.updateFadeIn);
    this.Threads.removeThread(this,this.updateFadeOut);
    this.Threads.removeThread(this,this.updateLight);
    for(var i=0;i<this.LightsNum;i++) {
        this.Lights[i].img.kill();
        this.Lights[i].img = null;
    }
    for(i=0;i<this.LinesNum;i++) {
        this.Lines[i].img.kill();
        this.Lines[i].img = null;
    }

    this.Papa.Field.OffFreenzy();
    this.FreenzyPanelImg.visible = false;
    this.FreenzyText.visible = false;
    this.FreenzySliderBgImg.visible = false;
    this.FreenzySliderImg.visible = false;
    this.BgFreenzyImg.visible = false;
    this.FadeFlag = false;
    this.ActiveFlag = false;
};

//################################################################################
//################################################################################
//################################################################################

CCameraShake = function (camera,threads) {

    this.Camera = camera;
    this.Threads = threads;
    this.ActiveFlag = false;
};

CCameraShake.prototype.create = function(rad,speed,time)
{
    this.Rad = rad;
    this.Speed = speed;
    this.TimeCntr = time;

    this.RadsFlag = false;
    if(this.Rad instanceof Array)
    {
        this.Rads = rad;
        this.RadsIndex = 0;
        this.RadsIndexNext = 1;
        this.Rad = this.Rads[this.RadsIndex];
        if(this.Rads.length>1) {
            this.RadsTime =  this.TimeCntr/(this.Rads.length-1);
            this.RadsTimeCntr = 0;
            this.RadsFlag = true;
        }
    }

    if(this.ActiveFlag) {
        this.Angle += Math.PI/2 +  Math.PI*Math.random();
        if(this.Angle>=(2*Math.PI)) this.Angle -= 2*Math.PI;
    }
    else {
        this.Angle = Math.random()*Math.PI;
        this.X = 0;
        this.Y = 0;
    }

    var r = this.Rad/3 + 2*Math.random()*this.Rad/3;
    this.X_dest = r*Math.cos(this.Angle);
    this.Y_dest = r*Math.sin(this.Angle);
    var dist = Math.sqrt((this.X_dest-this.X)*(this.X_dest-this.X)+
        (this.Y_dest-this.Y)*(this.Y_dest-this.Y));
    this.dX = this.X_dest - this.X;
    this.dY = this.Y_dest - this.Y;

    this.CoeffTime =  dist/this.Speed;
    this.CoeffTimeCntr = 0;
    this.Coeff = this.CoeffTimeCntr/this.CoeffTime;

    if(!this.ActiveFlag)
       this.Threads.addThread(this,this.update);

    this.FinishFlag = false;
    this.ActiveFlag = true;
};

CCameraShake.prototype.kill = function()
{
     if(!this.ActiveFlag )  return;
     this.X = 0;
     this.Y = 0;
     this.Camera._shake.x = this.X;
     this.Camera._shake.y = this.Y;
     this.Threads.removeThread(this,this.update);
     this.ActiveFlag = false;
};

CCameraShake.prototype.update = function()
{
    this.TimeCntr-=Base.RealTimeInt;
    this.CoeffTimeCntr+=Base.RealTimeInt;
    this.Coeff = this.CoeffTimeCntr/this.CoeffTime;
    this.X = this.X_dest - this.dX*(1-this.Coeff);
    this.Y = this.Y_dest - this.dY*(1-this.Coeff);
     this.Camera._shake.x = this.X;
     this.Camera._shake.y = this.Y;
   // this.Camera._shake.x = this.Rad*Math.random();
   // this.Camera._shake.y = this.Rad*Math.random();

    if(this.RadsFlag) {
        this.RadsTimeCntr+=Base.RealTimeInt;
        if(this.RadsTimeCntr>=this.RadsTime) {
            this.RadsIndex++;
            this.RadsIndexNext = this.RadsIndex  + 1;
            if(this.RadsIndex>=this.Rads.length)
                this.RadsIndex = 0;
            if(this.RadsIndexNext>=this.Rads.length)
                this.RadsIndexNext = 0;
            this.RadsTimeCntr = 0;
        }
    }

    if(this.Coeff>=1) {
        if(this.TimeCntr<0)
        {
            if(this.FinishFlag) {
                this.kill();
                return;
            }
            else
                this.FinishFlag = true;
        }
        if(this.RadsFlag)
           this.Rad = this.Rads[this.RadsIndex] +
              (this.RadsTimeCntr/this.RadsTime)*(this.Rads[this.RadsIndexNext] - this.Rads[this.RadsIndex]);

        this.Angle += Math.PI/2 +  Math.PI*Math.random();
        if(this.Angle>=(2*Math.PI)) this.Angle -= 2*Math.PI;
        var rad = this.Rad/2 + Math.random()*this.Rad/2;
        this.X_dest = rad*Math.cos(this.Angle);
        this.Y_dest = rad*Math.sin(this.Angle);
        if(this.FinishFlag) {
            this.X_dest = 0;
            this.Y_dest = 0;
        }
        var dist = Math.sqrt((this.X_dest-this.X)*(this.X_dest-this.X)+
            (this.Y_dest-this.Y)*(this.Y_dest-this.Y));
        this.dX = this.X_dest - this.X;
        this.dY = this.Y_dest - this.Y;
        this.CoeffTime =  dist/this.Speed;
        this.CoeffTimeCntr = 0;
    }
};
