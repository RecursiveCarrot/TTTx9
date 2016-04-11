
function GameManager() {
	this.board 				= new Board();
	this.availableBlocks	= __count_lst(9);
	this.scorecard			= __const_lst(9,0);
	this.lastmove 			= -1;
	this.player 			= true;
	this.over				= false;
	this.won 				= 0;

	this.block_lst = document.getElementsByClassName("grid-column"); 
	this.cell_lst = document.getElementsByClassName("cell-column");
	this.setup();
	this.run();
}

GameManager.prototype.setup = function() {
	for (var i=0; i<this.cell_lst.length; i++){
		this.cell_lst[i].setAttribute("id",i);
	};
};

GameManager.prototype.run = function() {
	var blocks = this.availableMoves();
	this.curBlock(this.lastmove);
	this.listen(blocks);
};

GameManager.prototype.listen = function(blocks) {
	for (var i =0; i<blocks.length; i++){
		var cell = this.cell_lst[blocks[i]];
		var game_manager = this
		cell.addEventListener("click", function (){
			if (game_manager.player && (Math.floor(this.id/9)==game_manager.lastmove 
				|| (game_manager.lastmove==-1 && game_manager.availableBlocks.indexOf(Math.floor(this.id/9))>-1)) && !game_manager.over){
				this.style.background = "rgba(118, 118, 218, 1)";
				game_manager.player = !game_manager.player;
				game_manager.lastmove = this.id%9;
				game_manager.board.cells[Math.floor(this.id/9)][this.id%9]=1;
				game_manager.blockTerminal();
				game_manager.boardTerminal();
				blocks = game_manager.availableMoves();
				if (!game_manager.over) {game_manager.curBlock();};
				this.removeEventListener("click", arguments.callee)
			}
			else if ((Math.floor(this.id/9)==game_manager.lastmove || (game_manager.lastmove==-1 && game_manager.availableBlocks.indexOf(Math.floor(this.id/9))>-1)) && !game_manager.over){
				this.style.background = "rgba(218, 118, 118, 1)";
				game_manager.player = !game_manager.player;
				game_manager.lastmove = this.id%9;
				game_manager.board.cells[Math.floor(this.id/9)][this.id%9]=-1;
				game_manager.blockTerminal();
				game_manager.boardTerminal();
				blocks = game_manager.availableMoves();
				if (!game_manager.over) {game_manager.curBlock();};
				this.removeEventListener("click", arguments.callee);
			}
			else{};
		});
	};
};

GameManager.prototype.curBlock = function() {
	for (var i = 0; i<this.block_lst.length; i++){
		this.block_lst[i].style.borderColor = "rgba(0, 0, 0, 0)";
	};
	if (this.lastmove == -1){
		if (!this.player){
			for (var i = 0; i<this.availableBlocks.length; i++){
				this.block_lst[this.availableBlocks[i]].style.borderColor = "rgba(218, 118, 118, 1)";
			};
		}
		else {
			for (var i = 0; i<this.availableBlocks.length; i++){
				this.block_lst[this.availableBlocks[i]].style.borderColor = "rgba(118, 118, 218, 1)";
			};
		};
	}
	else {
		if (!this.player){
			this.block_lst[this.lastmove].style.borderColor = "rgba(218, 118, 118, 1)";
		}
		else{
			this.block_lst[this.lastmove].style.borderColor = "rgba(118, 118, 218, 1)";
		};
	};
};

GameManager.prototype.blockTerminal = function() {
	triplets = [[0,1,2],[3,4,5],[6,7,8],[0,4,8],[2,4,6]
		,[0,3,6],[1,4,7],[2,5,8]]
	for (var i = 0; i<this.availableBlocks.length; i++){
		for (var j = 0; j<triplets.length; j++){
			var x = triplets[j][0];
			var y = triplets[j][1];
			var z = triplets[j][2];
			var k = this.availableBlocks[i];
			var cells = this.board.cells;
			if(cells[k][x]==cells[k][y] && cells[k][y]==cells[k][z]){
				if (cells[k][x] == 1){
					__del_elem(this.availableBlocks, k);
					this.scorecard[k]=1
					this.block_lst[k].style.background = "rgba(0, 0, 218, 0.5)";
				}
				else if (cells[k][x] == -1){
					__del_elem(this.availableBlocks, k);
					this.scorecard[k]=-1
					this.block_lst[k].style.background = "rgba(218, 0, 0, 0.5)";
				};
			}
			else{};
		};
	};
	for (var i = 0; i<this.availableBlocks.length; i++){
		var k = this.availableBlocks[i];
		var isFull = true;
		for (var j = 0; j<9; j++){
			if (this.board.cells[k][j]==0){
				isFull = false;
			};
		};
		if(isFull){
			__del_elem(this.availableBlocks, k);
		};
	};
};

GameManager.prototype.boardTerminal = function() {
	triplets = [[0,1,2],[3,4,5],[6,7,8],[0,4,8],[2,4,6]
		,[0,3,6],[1,4,7],[2,5,8]]
	for (var j = 0; j<triplets.length; j++){
		var x = triplets[j][0];
		var y = triplets[j][1];
		var z = triplets[j][2];
		var blocks = this.scorecard;
		if(blocks[x]==blocks[y] && blocks[y]==blocks[z]){
			if (blocks[x] == 1){
				this.won = 1;
				this.end();
				console.log("Blue Wins");
			}
			else if (blocks[x] == -1){
				this.won = -1;
				this.end();
				console.log("Red Wins");
			};
		}
		else{};
	};
};

GameManager.prototype.end = function(){
	this.over = true;
};

GameManager.prototype.availableMoves = function() {
	if (this.availableBlocks.indexOf(this.lastmove)<0){
		this.lastmove=-1;
		return __serial(this.availableBlocks, this.board.cells)
	}
	else {
		return __serial([this.lastmove], this.board.cells)
	};
};

function __serial(lst, test) {
	var outlst = []
	for (var i = 0; i<lst.length; i++){
		for (var j = 0; j<9; j++){
			if(test[lst[i]][j]==0){
				outlst.push(lst[i]*9+j);
			};
		};
	};
	return outlst;
};

function __count_lst(n) {
	var lst = [];
	for (var i = 0; i<n; i++){
		lst[i] = i;
	};
	return lst;
};

function __const_lst(n,val) {
	var lst = [];
	for (var i = 0; i<n; i++){
		lst[i] = val;
	};
	return lst;
};

function __del_elem(array,item) {
	var i = array.indexOf(item);
	if(i != -1) {
		array.splice(i, 1);
	}	
};