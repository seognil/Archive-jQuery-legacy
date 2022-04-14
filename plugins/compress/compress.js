function CompressAndUplaod() {
	var file = arguments[0],
		callUpload = arguments[1],
		imgId = arguments[2],
		compression = (arguments[3] || 0.4);
	var result;
	var oFReader = new FileReader();
	oFReader.onloadend = function() {
		var fileBase64 = oFReader.result;
		var img = new Image();
		img.onload = function() {
			//
			var uploadWidth, uploadHeight;
			var originWidth, originHeight;
			originWidth = img.width;
			originHeight = img.height;
			uploadWidth = originWidth;
			uploadHeight = originHeight;
			cvs = document.createElement('canvas');
			//
			var smallRatio;
			if ((smallRatio = uploadWidth * uploadHeight / 1638400) > 1) {
				smallRatio = Math.sqrt(smallRatio);
				uploadWidth = ~~(uploadWidth / smallRatio + 1);
				uploadHeight = ~~(uploadHeight / smallRatio + 1);
			} else {
				smallRatio = 1;
			}
			//
			cvs.width = uploadWidth;
			cvs.height = uploadHeight;
			var ctx = cvs.getContext("2d");
			//透明度图片白色背景
			ctx.fillStyle = '#fff';
			ctx.fillRect(0, 0, uploadWidth, uploadHeight);
			//瓦片绘制（IOS hack）
			var count;
			if ((count = uploadWidth * uploadWidth / 500000) > 1) {
				count = ~~(Math.sqrt(count) + 1);
				var unitWidth = ~~(uploadWidth / count);
				var unitHeight = ~~(uploadHeight / count);
				var clipWidth = ~~(originWidth / count);
				var clipHeight = ~~(originHeight / count);
				var tCanvas = document.createElement('canvas');
				tCanvas.width = unitWidth;
				tCanvas.height = unitHeight;
				var tctx = tCanvas.getContext("2d");
				for (var i = 0; i < count; i++) {
					for (var j = 0; j < count; j++) {
						tctx.fillStyle = '#fff';
						tctx.fillRect(0, 0, unitWidth, unitHeight);
						tctx.drawImage(img, i * clipWidth, j * clipHeight, clipWidth, clipHeight, 0, 0, unitWidth, unitHeight);
						ctx.drawImage(tCanvas, i * unitWidth, j * unitHeight, unitWidth, unitHeight);
					}
				}
			} else {
				ctx.drawImage(img, 0, 0, uploadWidth, uploadHeight);
			}
			//
			result = cvs.toDataURL("image/jpeg", compression);
			result = result.slice(result.indexOf(",") + 1);
			callUpload(result, imgId);
		};
		img.src = fileBase64;
	};
	oFReader.readAsDataURL(file);
};
