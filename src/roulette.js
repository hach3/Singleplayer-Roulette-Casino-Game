var ball = $(".ball");
var wrap = $(".wrap");
var isPlaying = false;
var bets = [];
var tokenValue = null;
var amountBet = 0;
var actions = [];

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
              reset();
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

  play();
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
      actions.push({value: valueBet, type: "multiple-pick", amount: tokenValue});

      for(var y = 0; y < numbers.length; ++y) {
        var found = isInBets("number", numbers[y]);
        if(found === false) {
          amountBet += tokenValue;
          bets.push({value: numbers[y], type: "number", amount: tokenValue});          
        }
        else {
          bets[found].amount += tokenValue;
          totalBet = bets[found].amount;
          amountBet += tokenValue;         
        }
        jQuery('#roulette-board button[attr-value="' + numbers[y] +'"] .token-bet').text(getTokenValue(totalBet)).css('display', 'flex');
      }
    break;
    default:
      //Check if bet is already selected
      var found = isInBets(typeBet, valueBet);
      actions.push({value: valueBet, type: typeBet, amount: tokenValue, item: jQuery(this)});

      if(found === false) {
        amountBet += tokenValue;
        bets.push({value: valueBet, type: typeBet, amount: tokenValue});
      }
      else {
        bets[found].amount += tokenValue;
        totalBet = bets[found].amount;
        amountBet += tokenValue;        
      }

      jQuery(this).find('.token-bet').text(getTokenValue(totalBet)).css('display', 'flex');
    break;
  }

  setInputBetAmount(amountBet);
});

/* RESET BETS */
jQuery(document).on('click', '.reset-board', function() {
  reset();
});

/* CANCEL LAST BET */
jQuery(document).on('click', '.cancel-board', function() {
  if(actions.length == 0) return;

  var lastAction = actions[actions.length - 1];
  switch(lastAction.type) {
    case "multiple-pick":
      var numbers = lastAction.value.split('-');

      for(var y = 0; y < numbers.length; ++y) {
        var found = isInBets("number", numbers[y]);
        if(found !== false) {
          bets[found].amount -= lastAction.amount;
          amountBet -= lastAction.amount;
          if(bets[found].amount <= 0) {
            jQuery('#roulette-board button[attr-value="' + numbers[y] +'"] .token-bet').text('').css('display', 'none');
          }
          else {
            jQuery('#roulette-board button[attr-value="' + numbers[y] +'"] .token-bet').text(getTokenValue(bets[found].amount)).css('display', 'flex');
          }
        }
      }
      setInputBetAmount(amountBet);
      actions.pop();
    break;
    default:
      var found = isInBets(lastAction.type, lastAction.value);
      if(found !== false) {
        bets[found].amount -= lastAction.amount;
        amountBet -= lastAction.amount;
        if(bets[found].amount <= 0) {
          lastAction.item.find('.token-bet').text('').css('display', 'none');
        }
        else {
          lastAction.item.find('.token-bet').text(getTokenValue(bets[found].amount)).css('display', 'flex');
        }
        setInputBetAmount(amountBet);
        actions.pop();
      }
    break;
  }
});

function play() {
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
}

function reset() {
  isPlaying = false;
  amountBet = 0;
  bets = [];
  actions = [];
  setInputBetAmount(amountBet);
  jQuery('.token-bet').text('').css('display', 'none');
}

function setInputBetAmount(_amount) {
  jQuery('#amount-bet').val(_amount);
}

function isInBets(type, value) {
  for(var i = 0; i < bets.length; ++i) {
    if(bets[i].type == type && bets[i].value == value) {
      return i;
    }
  }
  return false;
}

function getTokenValue(_token) {
  if (_token < 1000) {
    return _token.toString();
  }
  else if (_token < 10000000) {
    return _token / 1000 + 'K';
  }
  else if (_token < 1000000000) {
    return _token / 1000000 + 'M';
  }
  else {
    return _token / 1000000000 + 'B';
  }
}
