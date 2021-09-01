<?php
namespace MyApp;
use Ratchet\MessageComponentInterface;
use Ratchet\ConnectionInterface;
require_once ("/home/xpopikt/public_html/7243w2z5/DobbleGame.php");

class Chat implements MessageComponentInterface {
	protected $clients;
	protected $dobbleGame = null;
	protected int $playersCount = 0;
	protected array $playersNames = array();
	protected array $playersScore = array();

	public function __construct() {
	         $this->clients = new \SplObjectStorage;
	}
	public function onOpen(ConnectionInterface $conn) {
		$this->clients->attach($conn);
        echo "New connection! ({$conn->resourceId})\n";

        if ($this->playersCount)
            $conn->send(json_encode(array("countWasSet"=>$this->playersCount)));
    }


	public function onMessage(ConnectionInterface $from, $msg) {
        $this->clients->rewind();
		$numRecv = count($this->clients) - 1;
		echo sprintf('Connection %d sending message "%s" to %d other connection%s' . "\n", $from->resourceId, $msg, $numRecv, $numRecv == 1 ? '' : 's');
		if (str_contains ($msg,"deletePlayerCount"))
		    $this->deletePlayerCount();

		if (str_contains ($msg,"start"))
            $this->onClickStart($msg,$from);

        if ($this->dobbleGame)
            $this->playGame($msg,$from);

	}

	public function deletePlayerCount(){
	    $this->setDefault();
        foreach ($this->clients as $client) {
            $client->send("resetCount");
        }

    }
	public function playGame($msg, $from){
	    $this->playersCount = 0;
        if ($this->dobbleGame->checkRightPicture($msg))
        {
            $this->playersScore[$this->playersNames["id".$from->resourceId]]++;
            $newCardPair = $this->dobbleGame->getNewCardPair();
            $cards = array_merge($newCardPair,array("correctPicture"=>$msg,"cardCount"=>sizeof($this->dobbleGame->getAllCards())));
            if (!$newCardPair["new"])
                $cards = array_merge($cards,array("players"=>$this->playersScore));
            $this->sendCardToAll($cards);

            $this->endGame($newCardPair);
        }
    }

    public function endGame($newCardPair){
        if (!$newCardPair["new"])
            $this->detachAll();
    }

    public function onClose(ConnectionInterface $conn) {
	    $this->clients->detach($conn);
	    echo "Connection {$conn->resourceId} has disconnected\n";
	    if (!$this->isPlayersInGame())
            $this->deletePlayerCount();
    }

    public function onError(ConnectionInterface $conn, \Exception $e) {
	    echo "An error has occurred: {$e->getMessage()}\n";
	    $conn->close();
    }

    public function isPlayersInGame(): bool{
        $this->clients->rewind();
        while ($this->clients->valid()) {
            $object = $this->clients->current();
            $this->clients->next();
            if (array_key_exists("id" . $object->resourceId, $this->playersNames))
                return true;
        }
        return false;
    }

    public function onClickStart($msg, $from){
        if ($this->dobbleGame){
            $from->send("alreadyStart");
            return;
        }

        $startInfo = json_decode($msg);
        if ($startInfo[1] < 2 || $startInfo[1] > 8)
            return;
        $this->setNewPlayer($startInfo[2],$from->resourceId);
        if (!$this->playersCount){
            $this->playersCount = $startInfo[1];
            foreach ($this->clients as $client) {
                if ($client === $from)
                    $client->send("owner");
                else
                    $client->send(json_encode(array("countWasSet"=>$this->playersCount)));
            }
        }
        elseif ($this->playersCount <= sizeof($this->playersNames)){
            $this->dobbleGame = new \DobbleGame();
            $cards = array_merge($this->dobbleGame->getNewCardPair(),array("cardCount"=>sizeof($this->dobbleGame->getAllCards()),"start"=>true));
            $this->sendCardToAll($cards);
            return;
        }
        $from->send("waiting");
    }

    public function detachAll(){
        $this->clients->rewind();
        while ($this->clients->valid()) {
            $object = $this->clients->current();
            $this->clients->next();
            if (array_key_exists("id" . $object->resourceId, $this->playersNames))
                $object->close();
            else
                $object->send("resetCount");
        }
    }
    public function sendCardToAll($cards){
        $this->clients->rewind();
        while ($this->clients->valid()) {
            $object = $this->clients->current();
            if (array_key_exists("id" . $object->resourceId, $this->playersNames)){
                $object->send(json_encode($cards));
            }
            $this->clients->next();
        }
    }

    public function setDefault(){
        $this->dobbleGame = null;
        $this->playersCount = 0;
        $this->playersNames = array();
        $this->playersScore = array();
    }
    public function setNewPlayer($name, $id){
        $this->playersScore = array_merge($this->playersScore, array($name=>0));
        $this->playersNames = array_merge($this->playersNames, array("id".$id=> $name));
    }
}
