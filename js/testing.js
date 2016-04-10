var lst = document.getElementsByClassName("cell-column");
var cur = true;

for (i=0; i<lst.length; i++){
	lst[i].setAttribute("id",i)
	lst[i].addEventListener("click", function() {
		if (cur){
			this.style.background = "rgba(118, 118, 218, 1)";
		}
		else {
			this.style.background = "rgba(218, 118, 118, 1)";
		};
		cur = !cur;
		console.log(this.id);
	});
}