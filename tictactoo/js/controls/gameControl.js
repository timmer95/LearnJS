import { ReplayGameEvent } from "../eventing/events/ReplayGameEvent.js";
import { ResetGameEvent } from "../eventing/events/ResetGameEvent.js";

export function gameControl(
    eventBus,
    game,
) {
    //// States in gameControl, good or ugly? 
    const   states = ['askPlayer1', 'askPlayer2', 'game', 'gameOver'];

    function goToState(stateName) {
        function showState() {
            console.log(`Go to state ${stateName}`)
            states.forEach(id => {
                document.getElementById(id).style.display = id === stateName ? 'grid' : 'none';
            });
        }
        return showState
    }

    // Start the first window
    goToState('askPlayer1')();

    // Add state transitions
    document.getElementById("nextPlayer").addEventListener("click", goToState('askPlayer2'));
    document.getElementById("startGame").addEventListener("click", () => {
        goToState('game')();
        console.log('start game');
        game.takeTurn();
    });
    document.getElementById("endGame").addEventListener("click", goToState('gameOver'));
    document.getElementById("resetGame").addEventListener("click", goToState("askPlayer1"));
    document.getElementById("playAgain").addEventListener("click", goToState("game"));


    // Functionality for ReplayGameEvent
    const replayButtonElem = document.getElementById('replayGame');
    const playAgainButtonElem = document.getElementById('playAgain');
    [replayButtonElem, playAgainButtonElem].forEach( btn => {
        btn.addEventListener('click', () => {
            eventBus.publish(ReplayGameEvent.name, new ReplayGameEvent());
        })
    })

    eventBus.subscribe(ReplayGameEvent.name, (event) => onReplayGameEvent(event));

    function onReplayGameEvent(event) {
        game.reset({fullReset:false});  // excluding Player reset    
    }

    // Functionality for ResetGameEvent
    const resetButtonElem = document.getElementById('resetGame');
    resetButtonElem.addEventListener('click', () => {
        eventBus.publish(ResetGameEvent.name, new ResetGameEvent());
    })

    eventBus.subscribe(ResetGameEvent.name, (event) => onResetGameEvent(event));

    function onResetGameEvent(event) {
        game.reset({fullReset:true})    // including Player reset
    }    

}