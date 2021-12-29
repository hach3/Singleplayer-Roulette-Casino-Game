const ball = $(".ball");
const wheel = $(".wheel")
const wrap = $(".wrap");
const throwBall = $(".throw");
const title = $(".title");
const headOne = $(".h1");
const headTwo = $(".h2");
const start = $(".start");
let $input = $('.name');
let $value = $input.val();



//designate each number on the roulette wheel with a specific degree between 720-1080
const degrees = {
  7: 720,
  28: 729,
  12: 738,
  35: 748,
  3: 758,
  26: 768,
  0: 777,
  32: 787,
  15: 797,
  19: 807,
  4: 817,
  21: 826,
  2: 836,
  25: 846,
  17: 856,
  34: 865,
  6: 875,
  27: 885,
  13: 895,
  36: 905,
  11: 914,
  30: 924,
  8: 934,
  23: 944,
  10: 954,
  5: 964,
  24: 974,
  16: 983,
  33: 993,
  1: 1003,
  20: 1012,
  14: 1022,
  31: 1032,
  9: 1042,
  22: 1051,
  18: 1061,
  29: 1070,
}

class Selection {
  constructor(val) {
    this.val = val;
    this.$input = $('.name');
    this.$value = "";
    this.grabInput = this.grabInput.bind(this);
    this.tableClick = this.tableClick.bind(this);
  }

  //click on any number (flexbox) on the roulette table and the id of the number becomes the value in the val parameter
  //once clicked, have certain text displayed/hidden and listeners turned on/off
  table() {
    // let that = this
    $(".flex-item").on("click", this.tableClick)
  }

  tableClick(event) {
      this.val = event.currentTarget.id
      console.log(`${this.val} clicked`);
      $(".h1").css("display", "inline");
      headOne.html(`${this.$value} selected <span id='selected'>${this.val}</span>`);
      headTwo.css("display", "none");
      throwBall.css("display", "inline");
      throwBall.on();
  }

  //determine the winning # using the randomizing function and the degrees object to use at the rotation in the transform animation keyframe being added to the wrap Id.
  //add animation to the ball Id to lower the ball margin on the whirl to give a spiral effect with the rotation
  //winning logic
  //if the winning number selected in the randomization function is equal to the Id value of the number clicked on in the table, then the player wins, else, they lose.
  //once clicked, have certain text displayed/hidden and listeners turned on/off
  ballThrow() {
    throwBall.click(function() {
      console.log("Ball Thrown")
      $(".flex-item").off();
      throwBall.off();
        let winningNumber = Math.floor(Math.random() * 38)
        let rotation = degrees[winningNumber];
      //The following code found using the following link to push values into transform keyframe http://jsfiddle.net/LTNPs/2706/
      ball.css("animation", "ballDrop 2s forwards ease-in-out");
      wrap.animate({ $blah: rotation}, {
        step: function(now, fx) {
        $(this).css('transform', `rotate(${now}deg)`);
        }, duration: 5000,
        complete: function() {
          if(winningNumber === parseInt($("#selected")[0].innerText)) {
            $(".outcome").css("display", "inline");
            $(".outcome").html("You Win!")
            $(".restart").css("display", "inline");
          } else {
            $(".outcome").css("display", "inline");
            $(".outcome").html("You Lose!")
            $(".restart").css("display", "inline");
          }
        }
      });
      game.restartGame()
    });
  }

  //to start the game, click the start button and the table/wheel will be displayed and other text will also be display/hidden
  startGame() {
    start.click(function() {
      $(".p2").css("display", "none");
      $(".submit").css("display", "none");
      $(".directions").css("display", "none");
      $(".name").css("display", "none");
      $(".wheel").css("display", "inline");
      $(".table").css("display", "inline");
      $(".h2").css("display", "inline");
      game.table()
    });
  }

   //to restart the game, click the restart button the page will be refreshed.
   // alternative restart method is commented out which would have text be displayed/hidden
   // to chose a new number on the table and play again, but animation would not restart
  restartGame() {
    $(".restart").click(function() {
      $(document).ready(function(){
        $(".restart").click(function(){
            location.reload(true);
        });
      });
    });
    //   game.startGame()
    //   $(".h2").css("display", "inline");
    //   $(".h1").css("display", "none");
    //   ball.css("animation", "ballReset");
    //   $(".outcome").css("display", "none");
    //   $(".restart").css("display", "none");
    //   throwBall.css("display", "none");
    //   game.table()

    //   // game.ballThrow()
    //   throwBall.click(function() {
    //     console.log("Ball Thrown")
    //     $(".flex-item").off();
    //     throwBall.off();
    //       let winningNumber = Math.floor(Math.random() * 38)
    //       let rotation = degrees[winningNumber];
    //     ball.css("animation", "ballDrop 2s forwards ease-in-out");
    //     wrap.animate({ $blah2: rotation}, {
    //       step: function(now, fx) {
    //       $(this).css('transform', `rotate(${now}deg)`);
    //       }, duration: 5000,
    //       complete: function() {
    //         wrap.css("animation", "stop");
    //         if(winningNumber === parseInt($("#selected")[0].innerText)) {
    //          $(".outcome").css("display", "inline");
    //          $(".outcome").html("You Win!")
    //          $(".restart").css("display", "inline");
    //         } else {
    //          $(".outcome").css("display", "inline");
    //          $(".outcome").html("You Lose!")
    //          $(".restart").css("display", "inline");
    //         }
    //       }
    //     });
    //   });
    // });
  }

  // function to grab the information typed out in the form and use the value to display the players name once a number is selected
  inputForm() {
    const $button = $('button').click(this.grabInput)
    game.startGame()

    
    game.table()
  }

  grabInput() {
    this.$input = $('.name')
    this.$value = this.$input.val()
    this.table()
  }
}

const game = new Selection()
// game.inputForm()

$(".p2").css("display", "none");
$(".submit").css("display", "none");
$(".directions").css("display", "none");
$(".name").css("display", "none");
$(".wheel").css("display", "block");
$(".table").css("display", "inline");
$(".h2").css("display", "inline");
game.table();

let winningNumber = Math.floor(Math.random() * 38)
console.log('winningNumber', winningNumber);
let rotation = degrees[winningNumber];
//The following code found using the following link to push values into transform keyframe http://jsfiddle.net/LTNPs/2706/
ball.css("animation", "ballDrop 2s forwards ease-in-out");
wrap.animate({ $blah: rotation}, {
  step: function(now, fx) {
  $(this).css('transform', `rotate(${now}deg)`);
  }, duration: 5000,
  complete: function() {
    if(winningNumber === parseInt($("#selected")[0].innerText)) {
      // $(".outcome").css("display", "inline");
      // $(".outcome").html("You Win!")
      // $(".restart").css("display", "inline");
    } else {
      // $(".outcome").css("display", "inline");
      // $(".outcome").html("You Lose!")
      // $(".restart").css("display", "inline");
    }
  }
});
game.restartGame()


// game.ballThrow()




// game.restartGame()
// game.startGame()
// game.table()


// let grabInput = new Selection();
// let startGame = new Selection();
// let tableNumber = new Selection();
// let animTrigger = new Selection();
// let undoAnim = new Selection();
// let restartGame = new Selection();

