const ball = $(".ball");
const wrap = $(".wrap");
var isPlaying = false;
var bets = [
  {"amount":25,"type":"color","value":"red"}
];

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
  }

  roll(winningNumber) {
    console.log('winningNumber', winningNumber);
    ball.css("animation", "ballReset 0s forwards ease-in-out");
    wrap.animate({ $blah: 0}, {
      step: function(now, fx) {
        $(this).css('transform', `rotate(${now}deg)`);
      }, 
      duration: 0,
      complete: function() {
        setTimeout(function() {
          let rotation = degrees[winningNumber];

          ball.css("animation", "ballDrop 2s forwards ease-in-out");

          wrap.animate({ $blah: rotation}, {
            step: function(now, fx) {
              $(this).css('transform', `rotate(${now}deg)`);
            }, 
            duration: 5000,
            complete: function() {
              isPlaying = false;
            }
          });
        }, 500);
        

      }
    });    
  }
}

const game = new Selection();

jQuery(document).on('click', 'input[type="submit"]', function() {
  if(isPlaying) return false;

  isPlaying = true;

  $.ajax({
    type: "POST",
    url: "/play",
    data: {          
      bets: bets
    },
    success: function(data) {
      if(data && data.result && data.result.number_random != null) {
        game.roll(data.result.number_random);
      }      
    },
    error: function(err) {
      console.log('ERR', err);
    },
  });
  

  return false;
});
