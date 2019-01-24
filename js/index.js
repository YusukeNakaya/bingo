// JavaScript Document
(function($) {
  "use strict";

  var Index = $.index = (function() {
    var
      i = 0,
      j = 0,
      k = 0,

      memberList = [],
      offList = [],
      memberCount = 0,
      loadedCount = 0,
      photoScale = 5,
      photoWidth = 100 * photoScale,
      photoHeight = 100 * photoScale,
      selectKey = 0,

      $drum = null,
      lockFlg = true;

    function init() {
      $drum = document.getElementById('drum');

      var log = getLog()
      if (log) offList = log;
      else resetOffList();

      console.log("初期リスト", offList);

      $(window).on({
        "resize": function() {
          $("ul").css({width: window.innerWidth, height: window.innerHeight});
        }
      }).trigger("resize");

      // 画像プリロード
      for (i = 0; i < memberData.length; i++) {
        var
          $preLoadImg = $("<img>").attr("src", "img/" + memberData[i].id + ".jpg");

        memberCount++;

        $preLoadImg.on({
          "load": function() {
            var
              $this = $(this),
              img = new Image();

            img.src = $this.attr("src");

            onLoadImg();
          },
          "error": function(data) {
            console.error('error', data);
            onLoadImg();
          }
        });
      }
    }

    // 画像ロード完了カウンター
    function onLoadImg() {
      loadedCount++;
      if (memberCount <= loadedCount) {
        $(".loader").fadeOut(1000, initContent);
      }
    }

    function initContent() {
      lockFlg = true
      memberList = [];

      // リストを生成
      for (i = 0; i < memberData.length; i++) {
        var $li = $("<li></li>").appendTo("ul");

        $li.id = memberData[i].id;
        $li.name = memberData[i].name;

        memberList.push($li);

        $li.css({backgroundImage: "url(img/" + memberData[i].id + ".jpg"}).append("<span>" + memberData[i].name + "</span>").velocity({
          translateX: $(window).width() / 2 - photoWidth / 2,
          translateY: $(window).height() / 2 - photoHeight / 2,
          //translateZ: Math.random() * 400 + 100,
          rotateY: Math.random() * 720 - 360,
          rotateX: Math.random() * 720 - 360,
          scale: 0
        }, {
          duration: 0
        });

        //rotateX($li, Math.random() * 5000 + 10000);
        rotateY($li, Math.random() * 10000 + 15000);
        //translateX($li, Math.random() * 5000 + 10000);
        translateY($li, Math.random() * 5000 + 10000);
        //translateZ($li, Math.random() * 5000 + 10000);

        $li.velocity({
          translateZ: Math.random() * 300 + 150,
          scale: 1 / photoScale,
          rotateX: 0
        }, {
          delay: Math.random() * 500,
          duration: 4000,
          easing: "easeInOutCubic",
          queue: false,
          complete: function() {
            setTimeout(function() {
              lockFlg = false
            }, 1000)
          }
        });
      }

      // メンバーリストをシャッフル
      memberList = shuffle(memberList);

      $("ul").velocity({
        scale: 0.8,
        rotateX: 0,
        rotateY: 0
      }, {
        duration: 0
      });

      setTimeout(function() {
        $("ul").css("display", "block");
      }, 300);

      $(window).on({
        "keydown": function(e) {
          if (lockFlg) return;

          // zキーでリセット
          if (e.keyCode == 90) {
            resetOffList();
            return;
          }

          // 0~9キーのいずれかキーダウンで進行
          if (e.keyCode < 48 || e.keyCode > 57) {
            return;
          }
          selectKey = e.keyCode - 48;

          // イベントをオフ
          $(this).off();
          lockFlg = true

          // ドラムロール
          $drum.play();

          var
            leaveDistance = 1500,
            opacity = 0.1,
            leaveDelay = 0,
            duration = 1500,
            countDelay = 3000,
            easing = "easeInOutCubic";

          // 0キーは「10」として判定
          if (selectKey == 0) selectKey = 10;

          if (selectKey == 1) {
            // シングルヒット
            if (offList.length + 1 >= memberCount) resetOffList();

            // 当たり重複を防止
            for (i = 0; i < offList.length; i++) {
              if (memberList[memberCount - 1].id == offList[i].id) {
                console.log(memberList[memberCount - 1], "シフト");
                memberList.unshift(memberList[memberCount - 1]);
                memberList.pop();
                i = 0;
              }
            }

            // オフリストにあたりを追加
            var member = {
              id: memberList[memberCount - 1].id,
              name: memberList[memberCount - 1].name
            };
            offList.push(member);

            console.log("オフリスト確認:", offList.length, offList);

            setLog(offList)

            // COUNT 3
            for (i = 0; i < memberCount - 100; i++) {
              memberList[i].velocity({
                translateZ: leaveDistance,
                opacity: opacity
              }, {
                queue: false,
                delay: i * leaveDelay,
                duration: duration,
                easing: easing
              });
            }
            $("p").html("").velocity({
              fontSize: 900
            }, {
              duration: duration,
              easing: easing,
              begin: function() {
                $("p").html("3").css({fontSize: 300});
              }
            });

            // COUNT 2
            window.setTimeout(function() {
              // ドラムロール
              $drum.currentTime = 0;

              for (i = memberCount - 100; i < memberCount - 30; i++) {
                memberList[i].velocity({
                  translateZ: leaveDistance,
                  opacity: opacity
                }, {
                  queue: false,
                  delay: (i - 50) * leaveDelay,
                  duration: duration,
                  easing: easing
                });
              }
              $("p").velocity({
                fontSize: 900
              }, {
                elay: (i - 50) * leaveDelay,
                duration: duration,
                easing: easing,
                begin: function() {
                  $("p").html("2").css({fontSize: 300});
                }
              });
            }, countDelay);

            // COUNT 1
            window.setTimeout(function() {
              // ドラムロール
              $drum.currentTime = 0;

              for (i = memberCount - 30; i < memberCount - 10; i++) {
                memberList[i].velocity({
                  translateZ: leaveDistance,
                  opacity: opacity
                }, {
                  queue: false,
                  delay: (i - 80) * leaveDelay,
                  duration: duration,
                  easing: easing
                });
              }
              $("p").velocity({
                fontSize: 900
              }, {
                delay: (i - 80) * leaveDelay,
                duration: duration,
                easing: easing,
                begin: function() {
                  $("p").html("1").css({fontSize: 300});
                }
              });

              var
                shuffleNo = shuffle([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]),
                zeroX = $(window).width() / 2 - photoWidth / photoScale * 2 - photoWidth / photoScale / 2,
                zeroY = $(window).height() / 2 - photoHeight / photoScale * 2- photoHeight / photoScale / 2,
                counter = 0;

              for (i = memberCount - 10; i < memberCount; i++) {
                var
                  key = shuffleNo[counter];

                counter++;

                memberList[i].velocity({
                  translateZ: 0,
                  translateX: zeroX + photoWidth / photoScale * (key % 5) - photoWidth / photoScale * 2,
                  translateY: (key < 5) ? zeroY - (photoHeight / photoScale / 2) : zeroY + photoHeight / photoScale / 2,
                  rotateY: 0
                }, {
                  queue: false,
                  begin: function() {
                    $(this).velocity("stop");
                  },
                  delay: (i - memberCount - 10) * leaveDelay,
                  duration: duration,
                  easing: easing
                });
              }

              $("ul").velocity({
                rotateY: 360 + 20,
                rotateX: 360 + 20,
                scale: 1.5
              }, {
                duration: duration * 1.5,
                easing: "easeInOutCubic",
                begin: function() {
                  // ドラムロール
                  $drum.currentTime = 0;
                }
              }).velocity({
                rotateY: 360 - 40
              }, {
                duration: duration * 2,
                easing: easing,
                begin: function() {
                  // ドラムロール
                  $drum.currentTime = 0;
                }
              }).velocity({
                rotateY: 360 * 4,
                rotateX: 360
              }, {
                duration: duration * 3,
                easing: "easeInOutQuint",
                begin: function() {
                  $("p").html("");

                  // ドラムロール
                  $drum.currentTime = 0;

                  for (i = memberCount - 10; i < memberCount - 1; i++) {
                    memberList[i].velocity({
                      translateZ: leaveDistance,
                      opacity: opacity
                    }, {
                      queue: false,
                      delay: duration,
                      duration: duration,
                      easing: easing
                    });
                  }
                  memberList[memberCount - 1].velocity({
                    translateX: zeroX,
                    translateY: zeroY,
                    scale: 3 / photoScale
                  }, {
                    queue: false,
                    delay: duration,
                    duration: duration,
                    easing: easing,
                    complete: function() {
                      // ドラムロール
                      $drum.currentTime = 5.16;
                    }
                  });
                },
                complete: function() {
                  $(window).on({
                    "keydown": function(e) {
                      if (e.keyCode != 13) return false;
                      $(this).off();
                      $("p").html("");
                      $("ul").velocity({
                        scale: 0
                      }, {
                        duration: 1500,
                        easing: "easeInOutCubic",
                        complete: function() {
                          $("li").velocity("stop");
                          $("ul").html("");
                          initContent();
                        }
                      });
                    }
                  });//.trigger("click");
                }
              });
            }, countDelay * 2);
          } else {
            // ダブルヒット以上
            if (offList.length + 10 >= memberCount) resetOffList();

            // 当たり重複を防止
            var debugCount = 0;
            for (i = 0; i < offList.length; i++) {
              for (j = 0; j < selectKey; j++) {
                if (memberList[memberCount - 1 - j].id == offList[i].id) {
                  console.log(memberList[memberCount - 1 - j], "シフト");
                  memberList.unshift(memberList[memberCount - 1 - j]);
                  memberList.splice(memberCount - 1 - j + 1, 1);
                  i = 0;
                }
              }
            }

            // オフリストにあたりを追加
            for (i = 0; i < selectKey; i++) {
              var member = {
                id: memberList[memberCount - 1 - i].id,
                name: memberList[memberCount - 1 - i].name
              };
              offList.push(member);
            }

            console.log("オフリスト確認:", offList.length, offList);

            setLog(offList)

            // COUNT 2
            for (i = 0; i < memberCount - 80; i++) {
              memberList[i].velocity({
                translateZ: leaveDistance,
                opacity: opacity
              }, {
                queue: false,
                delay: i * leaveDelay,
                duration: duration,
                easing: easing
              });
            }
            $("p").html("").velocity({
              fontSize: 900
            }, {
              duration: duration,
              easing: easing,
              begin: function() {
                $("p").html("2").css({fontSize: 300});
              }
            });

            // COUNT 2
            window.setTimeout(function() {
              // ドラムロール
              $drum.currentTime = 0;

              for (i = memberCount - 80; i < memberCount - 20; i++) {
                memberList[i].velocity({
                  translateZ: leaveDistance,
                  opacity: opacity
                }, {
                  queue: false,
                  delay: (i - 50) * leaveDelay,
                  duration: duration,
                  easing: easing
                });
              }
              $("p").velocity({
                fontSize: 900
              }, {
                delay: (i - 50) * leaveDelay,
                duration: duration,
                easing: easing,
                begin: function() {
                  $("p").html("1").css({fontSize: 300});
                }
              });
            }, countDelay);

            // COUNT 1
            window.setTimeout(function() {
              // ドラムロール
              $drum.currentTime = 0;

              for (i = memberCount - 20; i < memberCount - selectKey; i++) {
                memberList[i].velocity({
                  translateZ: leaveDistance,
                  opacity: opacity
                }, {
                  queue: false,
                  delay: (i - 80) * leaveDelay,
                  duration: duration,
                  easing: easing
                });
              }
              $("p").velocity({
                fontSize: 500
              }, {
                delay: (i - 80) * leaveDelay,
                duration: duration,
                easing: easing,
                begin: function() {
                  $("p").html("BINGO!").css({fontSize: 50});
                },
                complete: function() {
                  // ドラムロール
                  $drum.currentTime = 5.16;
                }
              });

              var
                shuffleNo = [],
                zeroX = $(window).width() / 2 - photoWidth / photoScale * 2 - photoWidth / photoScale / 2,
                zeroY = $(window).height() / 2 - photoHeight / photoScale * 2- photoHeight / photoScale / 2,
                counter = 0;

              for (i = 0; i < selectKey; i++) {
                shuffleNo.push(i);
              }
              shuffleNo = shuffle(shuffleNo);

              if (selectKey < 5) {
                zeroX += photoWidth / photoScale / 2 * (5 - selectKey);
              }

              for (i = memberCount - selectKey; i < memberCount; i++) {
                var
                  key = shuffleNo[counter];

                counter++;

                memberList[i].velocity({
                  translateZ: 0,
                  translateX: zeroX + photoWidth / photoScale * (key % 5) - photoWidth / photoScale * 2,
                  translateY: (key < 5) ? zeroY - (photoHeight / photoScale / 2) : zeroY + photoHeight / photoScale / 2,
                  rotateY: 0
                }, {
                  queue: false,
                  begin: function() {
                    $(this).velocity("stop");
                  },
                  delay: (i - memberCount - 10) * leaveDelay,
                  duration: duration,
                  easing: easing
                });
              }

              $("ul").velocity({
                rotateY: 360,
                rotateX: 360,
                scale: 1.5
              }, {
                duration: duration * 1.5,
                easing: "easeInOutCubic",
                complete: function() {
                  $(window).on({
                    "keydown": function(e) {
                      if (e.keyCode != 13) return false;
                      $(this).off();
                      $("p").html("");
                      $("ul").velocity({
                        scale: 0
                      }, {
                        duration: 1500,
                        easing: "easeInOutCubic",
                        complete: function() {
                          $("li").velocity("stop");
                          $("ul").html("");
                          initContent();
                        }
                      });
                    }
                  });
                }
              });

            }, countDelay * 2);
          }
        }
      });

      //window.setTimeout(function() { $("body").trigger("click"); }, 5000);
    }

    function resetOffList() {
      offList = [];

      for (i = 0; i < memberData.length; i++) {
        if (memberData[i].escape) offList.push(memberData[i])
      }

      console.log("オフリストをリセット", offList);

      var $resetTag = $("<div class='reset_flg'>リセット</div>").appendTo("body");
      $resetTag.velocity({
        opacity: 0,
      }, {
        delay: 3000,
        duration: 1000,
        easing: "linear",
        complete: function() {
          $(this).remove();
        }
      });

      setLog(offList);
    }

    function setLog(data) {
      var seen = [];
      var replacer = function(key, value) {
        if (value != null && typeof value == "object") {
          if (seen.indexOf(value) >= 0) {
            return;
          }
          seen.push(value);
        }
        return value;
      };

      console.log("このログをセットする", data);
      localStorage.setItem("bingo", JSON.stringify(data, replacer));
      console.log("セットされたログを確認", localStorage.getItem("bingo"));
    }

    function getLog() {
      var log = localStorage.getItem("bingo");
      log = JSON.parse(log);
      console.log("ログをゲット", log);
      return log;
    }

    function translateX($object, speed) {
      $object.velocity({
        translateX: Math.random() * $(window).width()
      }, {
        duration: speed,
        easing: "easeInOutCubic",
        queue: false,
        complete: function() {
          translateX($object, speed);
        }
      });
    }

    function translateY($object, speed) {
      $object.velocity({
        translateY: Math.random() * $(window).height() / 2 + $(window).height() / 4 - 60 * 5
      }, {
        duration: speed,
        easing: "easeInOutSine",
        queue: false,
        complete: function() {
          translateY($object, speed);
        }
      });
    }

    function translateZ($object, speed) {
      $object.velocity({
        translateZ: Math.random() * 400 + 100 * 5
      }, {
        duration: 0,
        easing: "easeInOutCubic",
        queue: false,
        complete: function() {
          //translateZ($object, speed);
        }
      });
    }

    function rotateX($object, speed) {
      $object.velocity({
        rotateX: "+=360deg"
      }, {
        duration: speed,
        easing: "linear",
        queue: false,
        complete: function() {
          rotateX($object, speed);
        }
      });
    }
    function rotateY($object, speed) {
      $object.velocity({
        rotateY: "+=360deg"
      }, {
        duration: speed,
        easing: "linear",
        queue: false,
        complete: function() {
          rotateY($object, speed);
        }
      });
    }

    function shuffle(reciveArray) {
      var
        arrayLength = reciveArray.length,
        resultArray = reciveArray;

      while (arrayLength) {
        var
          m = Math.floor(Math.random() * arrayLength),
          n = resultArray[--arrayLength];

        resultArray[arrayLength] = resultArray[m];
        resultArray[m] = n;
      }

      return resultArray;
    }

    return {
      init: init
    }
  })();
  $(Index.init);
})(jQuery);