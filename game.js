matrix 			= 	[[],[],[],[]];
random_value 	= 	[1, 2, 4];
box_position 	= 	[
						['one_one',	 	'one_two', 		'one_three', 	'one_four'],
						['two_one',		'two_two', 		'two_three', 	'two_four'],
						['three_one', 	'three_two', 	'three_three', 	'three_four'],
						['four_one', 	'four_two', 	'four_three', 	'four_four']
					];
animation_time 	= 	500;
//tile_width 		= 	83;
//tile_height		=	83;
score = 0;
function start()
{
	$('#box .tiles').remove();
	$('#container').css({'opacity':1});
	var tile_number = parseInt( Math.random() * 2 ) + 1;// 0 <= tile_number <= 2
	var position_x = parseInt( Math.random() * 4 );// 0 <= position_x <=3
	var position_y = parseInt( Math.random() * 4 );// 0 <= position_y <=3
	for( var i = 0; i < 4; i++)
	{
		for( var j =0; j < 4; j++ )
		{
			var obj = { 
					tile_value	:0,
					left_tile	:false,
					right_tile	:false,
					top_tile	:false,
					bottom_tile	:false
				};
			matrix[i][j] = obj;
		}
	}
	
	matrix[position_y][position_x].tile_value = tile_number;
	
	var new_color = '';
	if( tile_number == 1 )
		new_color = 'one';
	else if(tile_number == 2 )
		new_color = 'two';
	else if( tile_number == 4 )
		new_color = 'four';
	$('#box').append('<div class="'+'tiles'+' '+new_color+' '+box_position[position_y][position_x]+'">'+tile_number+'</div>');
	$('.score').text('0');
}


function is_lose()
{
	for( var i = 0; i < 4; i++ )
	{
		for( var j = 0; j < 4; j++ )
		{
			if( matrix[i][j].tile_value == 0)
				return false;
			if( matrix[i][j].top_tile 		== true )
				return false;
			if( matrix[i][j].right_tile 	== true )
				return false;
			if( matrix[i][j].bottom_tile 	== true )
				return false;
			if( matrix[i][j].left_tile 		== true )
				return false;
		}
	}
	return true;
}
function getScore()
{
	return score;
}
function shift_right()
{
	var empty = [];
	for( var i = 0; i < 4; i++ )
	{
		var pointer = 3;
		for( var j = 3; j >= 0; j-- )
		{
			if( matrix[i][j].tile_value == 0 )
				continue;
			var temp_obj 		= matrix[i][j];
			matrix[i][j] 		= matrix[i][pointer];
			matrix[i][pointer] 	= temp_obj;
			pointer--;

			//sliding tiles
			var box_class = box_position[i][j];
			var new_box_class = box_position[i][pointer+1];
			
			if(new_box_class != box_class)
				$('.'+box_class).addClass(new_box_class).removeClass(box_class);			
			
			if(pointer+2 < 4 && matrix[i][pointer+1].tile_value == matrix[i][pointer+2].tile_value)
			{
				matrix[i][pointer+2].tile_value *= 2;
				score += matrix[i][pointer+2].tile_value;
				$('.score').text(score);
				$('.'+box_position[i][pointer+2]).text(matrix[i][pointer+2].tile_value);
				//changing color
				if( matrix[i][pointer+2].tile_value == 2 )
					$('.'+box_position[i][pointer+2]).addClass('two');
				else if( matrix[i][pointer+2].tile_value == 4 )
					$('.'+box_position[i][pointer+2]).addClass('four');
				else if( matrix[i][pointer+2].tile_value >= 256 )
					$('.'+box_position[i][pointer+2]).addClass('big');
				else
					$('.'+box_position[i][pointer+2]).addClass('rest');
				//removing tile
				$('.'+box_position[i][pointer+1]).remove();
				matrix[i][pointer+1].tile_value = 0;
				matrix[i][pointer+1].right_tile = false;
				matrix[i][pointer+1].left_tile = false;
				matrix[i][pointer+1].top_tile = false;
				matrix[i][pointer+1].bottom_tile = false;
				pointer++;
			}
			
		}
		empty[i] = pointer;
	}
	 vacant_row = [];
	for( var k = 0; k < 4; k++ )
	{
		if( empty[k] >= 0 )
			vacant_row.push( k );
	}
	var total_empty_row 	= vacant_row.length;
	var random_row 			= vacant_row[parseInt( Math.random() * total_empty_row )];// 0 <= random_row <= 3
	var random_column 		= parseInt( Math.random() * (empty[ random_row] + 1 ));//0 <= random_column <= 3
	var random_tile_value 	= random_value[ parseInt( Math.random() * 3) ];
	var color_class = '';
	if( random_tile_value == 1 )
		color_class = 'one';
	else if( random_tile_value == 2 )
		color_class = 'two';
	else if( random_tile_value == 4 )
		color_class = 'four';
	$('#box').append('<div class="'+'tiles'+' '+color_class+' '+box_position[random_row][random_column]+'">'+random_tile_value+'</div>');
	matrix[random_row][random_column].tile_value = random_tile_value;

	update_adjacent();

}

function shift_left()
{
	var empty = [];
	for( var i = 0; i < 4; i++ )
	{
		var pointer = 0;
		for( var j = 0; j < 4; j++ )
		{
			if( matrix[i][j].tile_value == 0 )
				continue;
			var temp_obj 		= matrix[i][j];
			matrix[i][j] 		= matrix[i][pointer];
			matrix[i][pointer] 	= temp_obj;
			pointer++;

			//sliding tiles
			var box_class = box_position[i][j];
			var new_box_class = box_position[i][pointer-1];
			
			if(new_box_class != box_class)
				$('.'+box_class).addClass(new_box_class).removeClass(box_class);			
			
			if(pointer-2 >=0 && matrix[i][pointer-1].tile_value == matrix[i][pointer-2].tile_value)
			{
				matrix[i][pointer-2].tile_value *= 2;
				score += matrix[i][pointer-2].tile_value;
				$('.score').text(score);
				$('.'+box_position[i][pointer-2]).text(matrix[i][pointer-2].tile_value);
				//changing color
				if( matrix[i][pointer-2].tile_value == 2 )
					$('.'+box_position[i][pointer-2]).addClass('two');
				else if( matrix[i][pointer-2].tile_value == 4 )
					$('.'+box_position[i][pointer-2]).addClass('four');
				else if( matrix[i][pointer-2].tile_value >= 256 )
					$('.'+box_position[i][pointer-2]).addClass('big');
				else
					$('.'+box_position[i][pointer-2]).addClass('rest');
				//removing tile
				$('.'+box_position[i][pointer-1]).remove();
				matrix[i][pointer-1].tile_value = 0;
				matrix[i][pointer-1].right_tile = false;
				matrix[i][pointer-1].left_tile = false;
				matrix[i][pointer-1].top_tile = false;
				matrix[i][pointer-1].bottom_tile = false;
				pointer--;
			}
			
		}
		empty[i] = pointer;
	}
	vacant_row = [];
	for( var k = 0; k < 4; k++ )
	{
		if( empty[k] < 4 )
			vacant_row.push( k );
	}
	var total_empty_row 	= vacant_row.length;
	var random_row 			= vacant_row[parseInt( Math.random() * total_empty_row )];// 0 <= random_row <= 3
	//var random_column 		= parseInt( Math.random() * (empty[ random_row] + 1 ));//0 <= random_column <= 3
	var random_column = empty[random_row] + parseInt(Math.random()*(4 - empty[random_row]));
	var random_tile_value 	= random_value[ parseInt( Math.random() * 3) ];
	var color_class = '';
	if( random_tile_value == 1 )
		color_class = 'one';
	else if( random_tile_value == 2 )
		color_class = 'two';
	else if( random_tile_value == 4 )
		color_class = 'four';
	$('#box').append('<div class="'+'tiles'+' '+color_class+' '+box_position[random_row][random_column]+'">'+random_tile_value+'</div>');
	matrix[random_row][random_column].tile_value = random_tile_value;

	update_adjacent();

}
function shift_top()
{
	var empty = [];
	for( var i = 0; i < 4; i++ )//column
	{
		var pointer = 0;
		for( var j = 0; j < 4; j++ )//row
		{
			if( matrix[j][i].tile_value == 0 )
				continue;
			var temp_obj 		= matrix[j][i];
			matrix[j][i] 		= matrix[pointer][i];
			matrix[pointer][i] 	= temp_obj;
			pointer++;

			//sliding tiles
			var box_class = box_position[j][i];
			var new_box_class = box_position[pointer-1][i];
			
			if(new_box_class != box_class)
				$('.'+box_class).addClass(new_box_class).removeClass(box_class);			
			
			if(pointer-2 >=0 && matrix[pointer-1][i].tile_value == matrix[pointer-2][i].tile_value)
			{
				matrix[pointer-2][i].tile_value *= 2;
				score += matrix[pointer-2][i].tile_value;
				$('.score').text(score);
				$('.'+box_position[pointer-2][i]).text(matrix[pointer-2][i].tile_value);
				//changing color
				if( matrix[pointer-2][i].tile_value == 2 )
					$('.'+box_position[pointer-2][i]).addClass('two');
				else if( matrix[pointer-2][i].tile_value == 4 )
					$('.'+box_position[pointer-2][i]).addClass('four');
				else if( matrix[pointer-2][i].tile_value >= 256 )
					$('.'+box_position[pointer-2][i]).addClass('big');
				else
					$('.'+box_position[pointer-2][i]).addClass('rest');
				//removing tile
				$('.'+box_position[pointer-1][i]).remove();
				matrix[pointer-1][i].tile_value = 0;
				matrix[pointer-1][i].right_tile = false;
				matrix[pointer-1][i].left_tile = false;
				matrix[pointer-1][i].top_tile = false;
				matrix[pointer-1][i].bottom_tile = false;
				pointer--;
			}
			
		}
		empty[i] = pointer;
	}
	 vacant_column = [];
	for( var k = 0; k < 4; k++ )
	{
		if( empty[k] < 4 )
			vacant_column.push( k );
	}
	var total_empty_column 	= vacant_column.length;
	var random_column 			= vacant_column[parseInt( Math.random() * total_empty_column )];// 0 <= random_row <= 3
	//var random_row 		= parseInt( Math.random() * (empty[ random_column] + 1 ));//0 <= random_column <= 3
	var random_row = empty[random_column] + parseInt(Math.random() * (4-empty[random_column]));
	var random_tile_value 	= random_value[ parseInt( Math.random() * 3) ];
	var color_class = '';
	if( random_tile_value == 1 )
		color_class = 'one';
	else if( random_tile_value == 2 )
		color_class = 'two';
	else if( random_tile_value == 4 )
		color_class = 'four';
	$('#box').append('<div class="'+'tiles'+' '+color_class+' '+box_position[random_row][random_column]+'">'+random_tile_value+'</div>');
	matrix[random_row][random_column].tile_value = random_tile_value;

	update_adjacent();

}
function shift_bottom()
{
	var empty = [];
	for( var i = 0; i < 4; i++ )//column
	{
		var pointer = 3;
		for( var j = 3; j >=0 ; j-- )//row
		{
			if( matrix[j][i].tile_value == 0 )
				continue;
			var temp_obj 		= matrix[j][i];
			matrix[j][i] 		= matrix[pointer][i];
			matrix[pointer][i] 	= temp_obj;
			pointer--;

			//sliding tiles
			var box_class = box_position[j][i];
			var new_box_class = box_position[pointer+1][i];
			
			if(new_box_class != box_class)
				$('.'+box_class).addClass(new_box_class).removeClass(box_class);			
			
			if(pointer+2 < 4 && matrix[pointer+1][i].tile_value == matrix[pointer+2][i].tile_value)
			{
				matrix[pointer+2][i].tile_value *= 2;
				score += matrix[pointer+2][i].tile_value;
				$('.score').text(score);
				$('.'+box_position[pointer+2][i]).text(matrix[pointer+2][i].tile_value);
				//changing color
				if( matrix[pointer+2][i].tile_value == 2 )
					$('.'+box_position[pointer+2][i]).addClass('two');
				else if( matrix[pointer+2][i].tile_value == 4 )
					$('.'+box_position[pointer+2][i]).addClass('four');
				else if( matrix[pointer+2][i].tile_value >= 256 )
					$('.'+box_position[pointer+2][i]).addClass('big');
				else
					$('.'+box_position[pointer+2][i]).addClass('rest');
				//removing tile
				$('.'+box_position[pointer+1][i]).remove();
				matrix[pointer+1][i].tile_value = 0;
				matrix[pointer+1][i].right_tile = false;
				matrix[pointer+1][i].left_tile = false;
				matrix[pointer+1][i].top_tile = false;
				matrix[pointer+1][i].bottom_tile = false;
				pointer++;
			}
			
		}
		empty[i] = pointer;
	}
	 vacant_column = [];
	for( var k = 0; k < 4; k++ )
	{
		if( empty[k] >=0 )
			vacant_column.push( k );
	}
	var total_empty_column 	= vacant_column.length;
	var random_column 			= vacant_column[parseInt( Math.random() * total_empty_column )];// 0 <= random_row <= 3
	//var random_row 		= parseInt( Math.random() * (empty[ random_column] + 1 ));//0 <= random_column <= 3
	var random_row = parseInt(Math.random() * (empty[random_column] + 1));
	var random_tile_value 	= random_value[ parseInt( Math.random() * 3) ];
	var color_class = '';
	if( random_tile_value == 1 )
		color_class = 'one';
	else if( random_tile_value == 2 )
		color_class = 'two';
	else if( random_tile_value == 4 )
		color_class = 'four';
	$('#box').append('<div class="'+'tiles'+' '+color_class+' '+box_position[random_row][random_column]+'">'+random_tile_value+'</div>');
	matrix[random_row][random_column].tile_value = random_tile_value;

	update_adjacent();

}


function update_adjacent()
{
	for( var i = 0; i < 4; i++ )
	{
		for( var j =0; j < 4; j++ )
		{
			
			//right
			if( j < 3 && matrix[i][j] != 0 && matrix[i][j].tile_value == matrix[i][j + 1].tile_value )
				matrix[i][j].right_tile = true; //document.write('hi');
			else
				matrix[i][j].right_tile = false;
			
			//left
			if( j >= 1 && matrix[i][j] != 0 && matrix[i][j].tile_value == matrix[i][j - 1].tile_value )
				matrix[i][j].left_tile = true;
			else
				matrix[i][j].left_tile = false;
			
			//bottom
			if( i < 3 && matrix[i][j] != 0 && matrix[i][j].tile_value == matrix[i + 1][j].tile_value )
				matrix[i][j].bottom_tile = true;
			else
				matrix[i][j].bottom_tile = false;
			
			//top
			if( i >= 1 && matrix[i][j] != 0 && matrix[i][j].tile_value == matrix[i - 1][j].tile_value )
				matrix[i][j].top_tile = true;
			else
				matrix[i][j].top_tile = false;
			
		}
	}
}