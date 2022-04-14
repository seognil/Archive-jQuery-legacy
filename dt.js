function dt() {
  if (!document.getElementById('dt')) {
    var $childNode = document.createElement('div')
    $childNode.setAttribute('id', 'dt')
    document.getElementsByTagName('body')[0].appendChild($childNode)
    var style = document.createElement("style")
    style.appendChild(document.createTextNode(""))
    document.head.appendChild(style)
    style.sheet.insertRule("#dt{z-index:99999999;position:fixed;width:100%;height:50vh;display:flex;flex-direction:column;justify-content:flex-end;bottom:0;left:0;right:0;background-color:hsla(0,0%,0%,0.3);pointer-events:none;padding:10px;font-size:20px;color:#fff;text-shadow:1px 1px 0 #000;overflow:hidden}", 0);
  }
  var $childNode = document.createElement('span')
  $childNode.innerHTML = Array.prototype.slice.call(arguments).join(" | ")
  document.getElementById("dt").appendChild($childNode)
}
