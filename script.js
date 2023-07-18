document.addEventListener("DOMContentLoaded", function () {
    let widthInput;
    let heightInput;
    let dimensionsVerified;
    let imageLoaded;

    function validDimensions() {
        widthInput = parseInt(document.getElementById("width-input").value);
        heightInput = parseInt(document.getElementById("height-input").value);

        const validWidth = 1 <= widthInput && widthInput <= 16;
        const validHeight = 1 <= heightInput && heightInput <= 16;

        const widthElement = document.getElementById("width-input");
        const heightElement = document.getElementById("height-input");

        widthElement.style.background = validWidth ? "" : "pink";
        heightElement.style.background = validHeight ? "" : "pink";

        dimensionsVerified = validWidth && validHeight;
        return dimensionsVerified;
    }

    function convertToPainting() {
        if (!validDimensions() || !imageLoaded) {
            return;
        }

        const originalImage = document.getElementById("original-image");
        const scaledImage = document.getElementById("painting");
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        canvas.width = widthInput * 16;
        canvas.height = heightInput * 16;
        ctx.drawImage(originalImage, 0, 0, canvas.width, canvas.height);

        const scaledCanvas = upscaleImage(canvas);
        scaledImage.src = scaledCanvas.toDataURL();
        document.getElementById("download-button").hidden = false;
    }

    function loadImage(event) {
        const input = event.target;
        const reader = new FileReader();

        reader.onload = function () {
            const img = document.getElementById("original-image");
            img.src = reader.result;
            img.onload = function () {
                if (validDimensions()) {
                    convertToPainting();
                } else {
                    const painting = document.getElementById("painting");
                    painting.src = "";
                    document.getElementById("download-button").hidden = true;
                }
            };
        };
        imageLoaded = true;
        reader.readAsDataURL(input.files[0]);

        // Display the file name
        const filename = input.files[0].name;
        const filenameElement = document.getElementById("image-filename");
        filenameElement.innerText = filename;
        filenameElement.style.visibility = "visible";
        document.getElementById("checkmark").style.visibility = "visible";
    }

    function upscaleImage(canvas) {
        const scaledCanvas = document.createElement("canvas");
        const ctx = scaledCanvas.getContext("2d");

        const scaledWidth = widthInput * 128;
        const scaledHeight = heightInput * 128;

        scaledCanvas.width = scaledWidth;
        scaledCanvas.height = scaledHeight;
        ctx.imageSmoothingEnabled = false;
        ctx.drawImage(canvas, 0, 0, scaledWidth, scaledHeight);

        return scaledCanvas;
    }

    function downloadImage() {
        const img = document.getElementById("painting");

        fetch(img.src)
            .then((response) => response.blob())
            .then((blob) => {
                const link = document.createElement("a");
                link.href = URL.createObjectURL(blob);
                const trimmedFilename = document.getElementById("image-file").files[0].name.replace(/\.[^/.]+$/, "");
                const imgName = `${trimmedFilename}_${widthInput}x${heightInput}.jpg`;
                link.download = imgName;
                link.click();
            });
    }

    function initialize() {
        convertToPainting();
    }

    document.getElementById("image-file").addEventListener("change", loadImage);
    document.getElementById("width-input").addEventListener("input", convertToPainting);
    document.getElementById("height-input").addEventListener("input", convertToPainting);
    document.getElementById("download-button").addEventListener("click", downloadImage);

    initialize();
});
