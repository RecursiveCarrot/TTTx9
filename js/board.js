function Board() {
	this.blockno = 9;
	this.cellno = 81;
	this.cells = this.cellinit()
}

Board.prototype.cellinit = function () {
	var cells = [];
	for (var x = 0; x < this.blockno; x++) {
		var block = cells[x] = [];
		for (var y = 0; y < this.blockno; y++){
			block[y] = 0;
		};
	};
	return cells;
};