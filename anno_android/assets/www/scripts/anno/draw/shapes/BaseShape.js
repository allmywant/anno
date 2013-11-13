define([
    "dojo/_base/declare",
    "dojo/_base/connect",
    "dojo/_base/lang",
    "dojo/window"
],
    function (
        declare,
        connect,
        lang,
        win
        )
    {
        /**
         * @author David Lee
         * base class of all shapes
         */
        return declare("anno.draw.shapes.BaseShape", null, {
            circleR: 16, // endpoint circle r
            hiddenStyle:"rgba(255, 255, 255, 0)",
            endpointStrokeStyle:"rgba(253, 155, 0, 1)",
            endpointFillStyle:"rgba(253, 155, 0, 0.5)",
            endpointHiddenStrokeStyle:"rgba(253, 155, 0, 0)",
            endpointHiddenFillStyle:"rgba(253, 155, 0, 0)",
            xFont:{family: "Helvetica", style: "normal", size: "16pt"},
            xColor:"rgba(253, 155, 0, 1)",
            xHiddenColor:"rgba(253, 155, 0, 0)",
            hiddenColor:"rgba(253, 155, 0, 0)",
            selected:false,
            deletable:true,
            constructor: function(args)
            {
                lang.mixin(this, args);
                this._connects = [];

                this.viewPoint = win.getBox();
            },
            createShape: function(args)
            {
            },
            destroy: function()
            {
                var gfxSurface = this.surface.surface;
                gfxSurface.remove(this.x);

                var connectResult = this._connects.pop();
                while (connectResult != null)
                {
                    connect.disconnect(connectResult);
                    connectResult = this._connects.pop();
                }
            },
            setSelected: function(sel)
            {
                this.selected = sel;

                if (sel&&this.deletable)
                {
                    this.x.setStroke(this.xColor).setFill(this.xColor);
                }
                else
                {
                    this.x.setStroke(this.xHiddenColor).setFill(this.xHiddenColor);
                }
            },
            isMoveable: function()
            {
                return this.selected;
            },
            rollbackEndpoint: function(endpoint, shift)
            {
                var o = endpoint.getShape();

                if (endpoint.declaredClass.indexOf("Rect") > 0)
                {
                    endpoint.setShape({x: o.x-shift.dx, y: o.y-shift.dy});
                }
                else if (endpoint.declaredClass.indexOf("Path") > 0)
                {
                    endpoint.applyTransform({dy: -shift.dy, dx: -shift.dx});
                }
                else
                {
                    endpoint.setShape({cx: o.cx-shift.dx, cy: o.cy-shift.dy});
                }
            },
            setId: function(id)
            {
                this.id = id;
            },
            onXTouched: function(e)
            {
                // fired when delete x clicked or touched.
                if (!this.deletable) return;
                var x = e.gfxTarget;
                if (!x) return;

                this.surface.removeShape(this);
            },
            isEndpointOutScreen: function(endpoint, dx, dy)
            {
                // check if shape's endpoint was dragged out of screen.
                var boundingBox = endpoint.getTransformedBoundingBox();
                var es = endpoint.getShape(), exl = boundingBox[0].x+dx, exr = boundingBox[1].x+dx, eyt = boundingBox[0].y+dy, eyb = boundingBox[2].y+dy;
                var vp = this.viewPoint;
                if (exl <= 1 || exr>= vp.w)
                {
                    return true;
                }

                if (eyt <= 1 || eyb>= vp.h)
                {
                    return true;
                }

                return false;
            }
        });
    });