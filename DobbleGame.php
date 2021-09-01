<?php
require_once "pictureArray.php";

class DobbleGame
{
    private array $allCards;
    private array $currentOldCard;
    private array $currentNewCard;
    private string $currentRightPicture;

    /**
     * DobbleGame constructor.
     */
    public function __construct()
    {
        $this->setAllCards(pictures);
        $this->performSetNewCurrentCard();
    }

    public function getNewCardPair():array{
        $this->setCurrentOldCard($this->getCurrentNewCard());
        if (empty($this->allCards))
            return array("old"=>$this->getCurrentOldCard(),"new"=>false);
        $this->performSetNewCurrentCard();
        $sameElement = array_intersect($this->currentNewCard,$this->currentOldCard);
        $this->setCurrentRightPicture(array_pop($sameElement));
        return array("old"=>$this->getCurrentOldCard(),"new"=>$this->getCurrentNewCard());
    }

    private function performSetNewCurrentCard(){
        $randomPosition = rand(0,sizeof($this->getAllCards())-1);
        $this->setCurrentNewCard($this->allCards[$randomPosition]);
        unset($this->allCards[$randomPosition]);
        $this->setAllCards(array_values($this->allCards));
    }

    public function checkRightPicture($picture): bool{
        if (!strcmp($this->currentRightPicture,$picture))
            return true;
        else
            return false;
    }

    /**
     * @return string
     */
    public function getCurrentRightPicture(): string
    {
        return $this->currentRightPicture;
    }

    /**
     * @param string $currentRightPicture
     */
    public function setCurrentRightPicture(string $currentRightPicture): void
    {
        $this->currentRightPicture = $currentRightPicture;
    }



    /**
     * @return array
     */
    public function getAllCards(): array
    {
        return $this->allCards;
    }

    /**
     * @param array $allCards
     */
    public function setAllCards(array $allCards): void
    {
        $this->allCards = $allCards;
    }

    /**
     * @return array
     */
    public function getCurrentOldCard(): array
    {
        return $this->currentOldCard;
    }

    /**
     * @param array $currentOldCard
     */
    public function setCurrentOldCard(array $currentOldCard): void
    {
        $this->currentOldCard = $currentOldCard;
    }

    /**
     * @return array
     */
    public function getCurrentNewCard(): array
    {
        return $this->currentNewCard;
    }

    /**
     * @param array $currentNewCard
     */
    public function setCurrentNewCard(array $currentNewCard): void
    {
        $this->currentNewCard = $currentNewCard;
    }







}
