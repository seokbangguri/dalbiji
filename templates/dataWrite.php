<html>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
<?php

	$host = 'localhost';
	$user = 'jiwoo';
	$pw = '0412';
	$dbName = 'test';
	$mysqli = new mysqli($host, $user, $pw, $dbName);

	$id = $_POST['id'];
	$Terminal_time = $_POST['Terminal_time'];
	$Server_time = $_POST['Server_time'];
	$x = $_POST['x'];
	$y = $_POST['y'];
	$bat_level = $_POST['bat_level'];
	$alarm = $_POST['alarm'];
	$ip = $_POST['ip'];

	$sql = "insert into positioning (
			id,
			Terminal_time,
			Server_time,
			x,
			y,
			bat_level,
			alarm,
			ip
	)";
	
	$sql = $sql. "values (
			'$id',
			'$Terminal_time',
			'$Server_time',
			'$x',
			'$y',
			'$bat_level',
			'$alarm',
			'$ip'
	)";

	if($mysqli->query($sql)){ 
	  echo '<script>alert("success inserting")</script>'; 
	}else{ 
	  echo '<script>alert("fail to insert sql")</script>';
	}

	mysqli_close($mysqli);
  
?>

<script>
	// location.href = "data_input.html";
</script>
</html>