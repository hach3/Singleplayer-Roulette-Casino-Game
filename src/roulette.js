var ball = $(".ball");
var wrap = $(".wrap");
var isPlaying = false;
var bets = [];
var tokenValue = null;
var amountBet = 0;

//designate each number on the roulette wheel with a specific degree between 720-1080
var degrees = {
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
          var rotation = degrees[winningNumber];

          ball.css("animation", "ballDrop 2s forwards ease-in-out");

          wrap.animate({ $blah: rotation}, {
            step: function(now, fx) {
              $(this).css('transform', `rotate(${now}deg)`);
            }, 
            duration: 5000,
            complete: function() {
              isPlaying = false;
              amountBet = 0;
              bets = [];
              jQuery('#amount-bet').val(amountBet);
              jQuery('.token-bet').text('').css('display', 'none');
            }
          });
        }, 200);
      }
    });    
  }
}

const game = new Selection();

jQuery(document).on('click', 'input[type="submit"]', function() {
  if(isPlaying) return false;
  if(bets.length == 0) return false;

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

/* PICK THE TOKEN VALUE */

jQuery(document).on('click', '.token-values li', function() {
  jQuery('.token-values li.active').removeClass('active');
  jQuery(this).addClass('active');
  tokenValue = jQuery(this).attr('attr-amount');
  tokenValue = parseInt(tokenValue);
});

/* Click on board number = BET */

jQuery(document).on('click', '#roulette-board button', function() {
  if(tokenValue ==  null) return;

  var valueBet = jQuery(this).attr('attr-value');
  var typeBet = jQuery(this).attr('attr-type');
  var totalBet = tokenValue;
  
  if(valueBet == null || typeBet == null) return;
  
  switch(typeBet) {
    case "multiple-pick":
      var numbers = valueBet.split('-');
      for(var y = 0; y < numbers.length; ++y) {
        var found = false;
        for(var i = 0; i < bets.length; ++i) {
          if(bets[i].type == "number" && bets[i].value == numbers[y]) {
            //Found it => Add the amount selected to bet
            bets[i].amount += tokenValue;
            found = true;
            totalBet = bets[i].amount;
            amountBet += tokenValue;            
            break;
          }
        }
        if(!found) {
          amountBet += tokenValue;
          bets.push({value: numbers[y], type: "number", amount: tokenValue});
        }
        jQuery('#roulette-board button[attr-value="' + numbers[y] +'"] .token-bet').text(totalBet).css('display', 'flex');
      }
    break;
    default:
      //Check if bet is already selected
      var found = false;
      for(var i = 0; i < bets.length; ++i) {
        if(bets[i].type == typeBet && bets[i].value == valueBet) {
          //Found it => Add the amount selected to bet
          bets[i].amount += tokenValue;
          found = true;
          totalBet = bets[i].amount;
          amountBet += tokenValue;
          break;
        }
      }
      if(!found) {
        amountBet += tokenValue;
        bets.push({value: valueBet, type: typeBet, amount: tokenValue});
      }
      jQuery(this).find('.token-bet').text(totalBet).css('display', 'flex');
    break;
  }

  jQuery('#amount-bet').val(amountBet);
  console.log('BETS', bets);
});
