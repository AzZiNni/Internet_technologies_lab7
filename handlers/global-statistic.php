<?php

    require "ui-components.php";
    require "database/config.php";
    require "utils.php";

    require "parts/head.html";
?>

<main role="main">
    <div class="container">
        <?php print_header();?>
        <div class="row">
            <div class="col-md-8">
                <form action="global-statistic.php" method="POST">

            <p>
                <label for="date">Дата 1: </label>
                <input type="date" id="date1" name="date_1" />
            </p>
           
            <p>
                <label for="date">Дата 2: </label>
                <input type="date" id="date2" name="date_2" />
            </p>
            <p>
                <button type="submit">Отправить</button>
            </p>
                </form>
                <?php 
                if(isset($_POST['date_1']) and isset($_POST['date_2']) ){ 
                    if($_POST['date_1'] != "" and $_POST['date_2'] != "")
                    {
                        try{
                            $stmt = $pdo->prepare("SELECT `start`, `stop`, `in_traffic`, `out_traffic`, `name`, `IP` FROM SEANSE AS a INNER JOIN `client` AS b ON a.client_id = b.id WHERE date(a.start) >? and date(a.stop)<?");
                            $l_values = [
                                $_POST['date_1'],
                                $_POST['date_2']
                            ];
                            
                            $result = $stmt->execute($l_values);
                            $statistic = $stmt ->fetchAll(PDO::FETCH_ASSOC);
                        }catch (PDOException $e){
                            echo "<p class='text-danger text-center'><b>Error!: " . $e->getMessage() . "</b></p><br/>"; die();
                        }

                        $xml = new DomDocument('1.0','utf-8');
                        $xml->formatOutput = true;
                        $xmlStatistics = $xml->appendChild($xml->createElement('statistics'));
                        foreach ($statistics as $stat){
                            $xmlStatistic = $xmlStatistics->appendChild($xml->createElement('statistic'));
                        foreach ($stat as $key => $val){
                         $xmlName = $xmlStatistic->appendChild($xml->createElement($key));
                         $xmlName->appendChild($xml->createTextNode($val));
                             }
                         }
                        echo $xml->saveXML();
                        
                        
                    }
                    else{
                        echo "<p class='text-warning '> Введите дату наконец-то </p>";
                    }
                }
               
               
                ?>
                </table>
            </div>
        </div>
        
    </div>
</main>

<?php require "parts/tail.html";
