<?php 

    error_reporting(E_ALL); 
    ini_set('display_errors',1); 

    include('dbcon.php');

    $ip_address;

    $ip_address = $_SERVER["REMOTE_ADDR"];

    $android = strpos($_SERVER['HTTP_USER_AGENT'], "Android");

    date_default_timezone_set('Asia/Seoul');

    if( (($_SERVER['REQUEST_METHOD'] == 'POST') && isset($_POST['submit'])) || $android )
    {

        // 안드로이드 코드의 postParameters 변수에 적어준 이름을 가지고 값을 전달 받는다.

        $id=$_POST['id'];
        $Terminal_time=$_POST['Terminal_time']; // 단말 TimeStamp는 POST로 전달받음    
        $Server_time=date('Y-m-d H:i:s.').gettimeofday()['usec'];
        $x=$_POST['x'];
        $y=$_POST['y'];
        $bat_level=$_POST['bat_level'];

        // 위험지역 침범 체크 

        if((($x > 300) && ($x < 600)) && (($y > 50) && ($y < 100))){
            $alarm = Y;    
        }else{
            $alarm = N;
        } 

        
        $ip = $ip_address;
        

        if(empty($id)){
            $errMSG = "Input id";
        }
        else if(empty($Terminal_time)){
            $errMSG = "Input Terminal_time";
        }
        else if(empty($Server_time)){
            $errMSG = "Input Server_time";
        }
        else if(empty($x)){
            $errMSG = "Input x";
        }
        else if(empty($y)){
            $errMSG = "Input y";
        }
        else if(empty($bat_level)){
            $errMSG = "Input bat_level";
        }


        if(!isset($errMSG))
        {
            try{
                $stmt = $con->prepare('INSERT INTO positioning(id, Terminal_time, Server_time, x, y, bat_level, alarm, ip) VALUES(:id, :Terminal_time, :Server_time, :x, :y, :bat_level, :alarm, :ip)');
                $stmt->bindParam(':id', $id);
                $stmt->bindParam(':Terminal_time', $Terminal_time);
                $stmt->bindParam(':Server_time', $Server_time);
                $stmt->bindParam(':x', $x);
                $stmt->bindParam(':y', $y);
                $stmt->bindParam(':bat_level', $bat_level);
                $stmt->bindParam(':alarm', $alarm);
                $stmt->bindParam(':ip', $ip);

                if($stmt->execute())
                {
                    $successMSG = "New record addition";
                }
                else
                {
                    $errMSG = "record addition error";
                }

            } catch(PDOException $e) {
                die("Database error: " . $e->getMessage()); 
            }
        }

    }
?>

<html>
   <body>
        <?php 
        if (isset($errMSG)) echo $errMSG;
        if (isset($successMSG)) echo $successMSG;
        ?>
        
        <form action="<?php $_PHP_SELF ?>" method="POST">
            id: <input type = "text" name = "id" /><br>
            Terminal_time: <input type = "text" name = "Terminal_time" /><br>
            Server_time: <input type = "text" name = "Server_time" /><br>
            x: <input type = "text" name = "x" /><br>
            y: <input type = "text" name = "y" /><br>
            bat_level: <input type = "text" name = "bat_level" /><br>
            <input type = "submit" name = "submit" />
        </form>
   
   </body>
</html>