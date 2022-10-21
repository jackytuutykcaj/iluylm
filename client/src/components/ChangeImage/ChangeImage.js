import React, { useEffect, useState } from 'react';
import resizeImageData from 'resize-image-data';
import './ChangeImage.css'


function ChangeImage({username, close}) {
    const [mouseDown, isMouseDown] = useState(false);
    const [squareWidth, setSquareWidth] = useState(0);
    const [coords, setCoords] = useState([]);

    async function fetchData(url = '', data = {}) {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        return response.json()
    }

    function drawImage() {
        var canvas = document.getElementById('canvas');
        var ctx = canvas.getContext('2d');
        var cropper = document.getElementById('cropper');
        var ctx2 = cropper.getContext('2d');
        var preview = document.getElementById('preview');
        var pctx = preview.getContext('2d');
        var img = new Image();
        img.onload = function () {
            // set size proportional to image
            canvas.height = canvas.width * (img.height / img.width);
            cropper.height = canvas.height

            // step 1 - resize to 50%
            var oc = document.createElement('canvas'),
                octx = oc.getContext('2d');

            oc.width = img.width;
            oc.height = img.height;
            octx.drawImage(img, 0, 0, oc.width, oc.height);

            // step 2
            octx.drawImage(oc, 0, 0, oc.width, oc.height);

            // step 3, resize to final size
            ctx.drawImage(oc, 0, 0, oc.width, oc.height, 0, 0, canvas.width, canvas.height);

            ctx2.beginPath();
            var width = canvas.width;
            if (canvas.width > canvas.height) {
                width = canvas.height;
            }
            setSquareWidth(width)
            drawRect(ctx2, width, 1, 1);

            var imageData = ctx.getImageData(1, 1, width, width);
            const result = resizeImageData(imageData, 100, 100, 'bilinear-interpolation');
            preview.width = result.width;
            preview.height = result.height;
            pctx.putImageData(result, 0, 0);
            document.getElementById('previewdiv').style.display = "block";
        }
        img.src = URL.createObjectURL(document.getElementById('input').files[0]);
    }

    function drawRect(ctx2, width, x, y) {
        setCoords([x, y]);
        ctx2.clearRect(0, 0, document.getElementById('cropper').width, document.getElementById('cropper').height);
        ctx2.beginPath();
        ctx2.rect(x, y, width - 1, width - 1);
        ctx2.lineWidth = 5;
        ctx2.strokeStyle = "grey"
        ctx2.stroke();
    }

    function mouseHandler(e) {
        if (e.type === "mousedown") {
            isMouseDown(true)
            var rect = document.getElementById('cropper').getBoundingClientRect();
            var x = Math.round(e.clientX - rect.left);
            var y = Math.round(e.clientY - rect.top);
        } else {
            isMouseDown(false);
        }
    }

    function mouseMove(e) {
        if (e.type === "mousemove") {
            var rect = document.getElementById('cropper').getBoundingClientRect();
            var x = Math.round(e.clientX - rect.left) - (squareWidth / 2);
            var y = Math.round(e.clientY - rect.top) - (squareWidth / 2);
            var ctx2 = document.getElementById('cropper').getContext('2d');
            if (mouseDown) {
                if (x < 1) {
                    x = 1;
                }
                if (y < 1) {
                    y = 1;
                }
                if (x + squareWidth > rect.width) {
                    x = rect.width - squareWidth;
                }
                if (y + squareWidth > rect.height) {
                    y = rect.height - squareWidth;
                }
                drawRect(ctx2, squareWidth, x, y);

                const canvas = document.getElementById('canvas');
                const ctx = canvas.getContext('2d');

                var imageData = ctx.getImageData(x, y, squareWidth, squareWidth);

                const result = resizeImageData(imageData, 100, 100, 'bilinear-interpolation');

                const preview = document.getElementById('preview');
                const previewctx = preview.getContext('2d');
                preview.width = result.width;
                preview.height = result.height;
                previewctx.putImageData(result, 0, 0);
            }
        }
    }

    function applyImage() {
        if(document.getElementById('previewdiv').style.display === 'block'){
            const preview = document.getElementById('preview');
            var dataurl = preview.toDataURL();
            fetchData('http://153.92.214.195:8082/uploadimage', { dataurl, username })
            .then(result =>{
                close(false);
            })
        }
    }

    return (
        <div className='ChangeImage'>
            <canvas id='canvas'></canvas>
            <canvas id='cropper' onMouseDown={mouseHandler} onMouseUp={mouseHandler} onMouseMove={mouseMove}></canvas>
            <label className='browse'>
                <input id='input' type="file" accept='image/jpeg, image/png' onChange={drawImage} />
                Browse Image
            </label>
            <br />
            <p style={{ marginLeft: '310px', marginTop: '0', marginBottom: '10px' }}>Drag the square</p>
            <label className='apply' onClick={applyImage}>
                Apply
            </label>
            <div id='previewdiv' style={{ marginLeft: '310px', marginTop: '0', marginBottom: '10px', display: "none"}}>
                <p>Preview</p>
                <canvas id='preview'></canvas>
            </div>
        </div>
    )
}

export default ChangeImage;