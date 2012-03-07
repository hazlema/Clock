Number.implement(
{
    toRad: function()
    {
        return (Math.PI/180)*this;
    }
});

var myCanvas = new Class(
{
    initialize: function()
    {
        this.canvas = null;
        this.ctx    = null;
        this.size   = null;

        if (this.canvas = $('myCanvas'))
        {
            this.ctx = this.canvas.getContext('2d');

            this.size =
            {
                width:  this.canvas.get('width'),
                height: this.canvas.get('height'),
                radius: (this.canvas.get('width') / 2) - 50,
                center:
                {
                    x: this.canvas.get('width') / 2,
                    y: this.canvas.get('height') / 2
                }
            }

            this.drawClock();
            this.tick();
            setInterval(function() { this.tick(); }.bind(this), 1000);

        } else {
            alert('Canvas element not detected');
        }
    },

    /***
     * Purpose: Draw the clock face and hash marks
     *    Args: none
     */
    drawClock: function()
    {
        //
        // Outer Rim
        //
        this.ctx.fillStyle   = '#cecece';
        this.ctx.strokeStyle = '#000000';

        this.ctx.beginPath();
        this.ctx.arc(this.size.center.x, this.size.center.y, this.size.radius, 0, Number.toRad(360), 0);
        this.ctx.fill();
        this.ctx.stroke();
        this.ctx.closePath();

        //
        // Inner Rim
        //
        this.ctx.fillStyle   = '#fff';
        this.ctx.strokeStyle = '#000000';

        this.ctx.beginPath();
        this.ctx.arc(this.size.center.x, this.size.center.y, this.size.radius-10, 0, Number.toRad(360), 0);
        this.ctx.fill();
        this.ctx.stroke();
        this.ctx.closePath();

        //
        // Hash marks
        //
        this.ctx.fillStyle   = '#ffffff';
        this.ctx.strokeStyle = '#000000';

        this.ctx.save();
        this.ctx.translate(this.size.center.x, this.size.center.y);

        for (ticks=1; ticks <= 60; ticks++)
        {
            this.ctx.beginPath();
            this.ctx.moveTo(0, this.size.radius - 10);

            if ((ticks-1)%5==0)
            {
                this.ctx.strokeStyle = '#333';
                this.ctx.lineTo(0, this.size.radius - 30);
            } else {
                this.ctx.strokeStyle = '#999';
                this.ctx.lineTo(0, this.size.radius - 20);
            }

            this.ctx.stroke();
            this.ctx.closePath();

            this.ctx.rotate((360/60).toRad());
         }
         this.ctx.restore();
    },

    /***
     * Purpose: Clear the face of the clock
     *    Args: none
     */
    clearFace: function()
    {
        this.ctx.fillStyle='#FFFFFF';
        this.ctx.strokeStyle='#000000';

        this.ctx.beginPath();
        this.ctx.arc(this.size.center.x, this.size.center.y, this.size.radius-30, 0, Number.toRad(360), 0);
        this.ctx.fill();
        this.ctx.closePath();
    },

    /***
     * Purpose: Draw a hand on the clock
     *    Args: Angle = The angle of the hand in radations
     *          Len   = Length of the hand
     *          Width = Width of the hand
     */
    drawHand: function(Angle, Len, Width)
    {
        this.ctx.strokeStyle = '#000000';
        this.ctx.lineCap     = 'round';
        this.ctx.lineWidth   = Width;

        this.ctx.save();
        this.ctx.translate(this.size.center.x, this.size.center.y);

        //
        // Rotate to the 12 o'clock position (180 degrees) then rotate the
        // number of radations for the hand
        //
        this.ctx.rotate(Number.toRad(180) + Angle);
        this.ctx.moveTo(0, -10);
        this.ctx.lineTo(0, (this.size.radius - 100) + Len);
        this.ctx.stroke();

        this.ctx.restore();
    },

    /***
     * Purpose: Determin the correct angles for the hands and draw them
     *    Args: none
     */
    tick: function()
    {
        //
        // Get Current Time
        //
        thisTime = new Date();

        thisHr = thisTime.get('hr') > 12 ? thisTime.get('hr') - 12 : thisTime.get('hr');
        thisMn = thisTime.get('min');
        thisSc = thisTime.get('sec');

        //
        // Calculaate Degrees
        //
        thisHrDeg = (360/12) * thisHr;
        thisMnDeg = (360/60) * thisMn;
        thisScDeg = (360/60) * thisSc;
        thisSmDeg = ((30 * thisMnDeg) / 360);       // Minutes for the hour hand


        //
        // Debug
        //
        //console.log(' ');
        //console.log('Hour- Value: %d, Degrees: %d, Rad: %d', thisHr, thisHrDeg, thisHrDeg.toRad());
        //console.log('Min- Value: %d, Degrees: %d, Rad: %d', thisMn, thisMnDeg, thisMnDeg.toRad());
        //console.log('Sec- Value: %d, Degrees %d, Rad: %d', thisSc, thisScDeg, thisScDeg.toRad());

        //
        // Draw Hands
        //
        this.clearFace();
        this.ctx.beginPath();
        this.drawHand((thisHrDeg+thisSmDeg).toRad(), 0, 4);
        this.drawHand(thisMnDeg.toRad(), 50, 2);
        this.drawHand(thisScDeg.toRad(), 50, 1);
        this.ctx.closePath();
    }
});

window.addEvent('domready', function()
{
    new myCanvas();
});
