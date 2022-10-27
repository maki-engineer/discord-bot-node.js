"use strict";

// SQLite3導入
const sqlite3 = require("sqlite3");
const db      = new sqlite3.Database("235data.db");

// request モジュール導入
const request = require("request");

// 別ファイル導入
const birthday_for_235_member     = require("./birthday-for-235-member");
const birthday_for_million_member = require("./birthday-for-million-member");
const information                 = require("./information-for-235");
const def                         = require("./function");

// twitter導入
let twitter      = require("twitter");
let twitterToken = require("./twitter-token.json");
let bot          = new twitter({
  consumer_key       : twitterToken.consumer_key,
  consumer_secret    : twitterToken.consumer_secret,
  access_token_key   : twitterToken.access_token_key,
  access_token_secret: twitterToken.access_token_secret
});

// discord.js導入
const { Client, GatewayIntentBits } = require("discord.js");
const token                         = require("./discord-token.json");
const client                        = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildBans,
    GatewayIntentBits.GuildEmojisAndStickers,
    GatewayIntentBits.GuildIntegrations,
    GatewayIntentBits.GuildWebhooks,
    GatewayIntentBits.GuildInvites,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildPresences,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.GuildMessageTyping,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.DirectMessageReactions,
    GatewayIntentBits.DirectMessageTyping,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildScheduledEvents
  ]
});

// 常時行う処理
client.on("ready", () => {

  if(client.guilds.cache.get(information.server_for_235) !== undefined){
    client.application.commands.set(information.commands, information.server_for_235);
  }

  client.user.setPresence({
    activities: [{name: "アイドルマスター ミリオンライブ! シアターデイズ "}],
    status: "online"
  });

  setInterval(() => {
    // 日付設定
    let today       = new Date();
    let today_year  = today.getFullYear();
    let today_month = today.getMonth() + 1;
    let today_date  = today.getDate();
    let today_day   = today.getDay();
    let today_hour  = today.getHours();
    let today_min   = today.getMinutes();


    // 雑談場（通話外）でメッセージ送信して1週間経ったメッセージは削除する
    if(client.channels.cache.get(information.channel_for_235_chat_place) !== undefined){

      let setTime = new Date();
      setTime.setDate(setTime.getDate() - 7);
      let dateSevenDaysAgo = setTime.getDate();

      db.all("select * from delete_messages where date = ?", dateSevenDaysAgo, (err, rows) => {
        if(rows.length > 0){
          let deleteIndex = 0;
          let deleteTimer = setInterval(() => {
            switch(deleteIndex){
              case rows.length:
  
                clearInterval(deleteTimer);
                break;
  
              default:
  
                client.channels.cache.get(information.channel_for_235_chat_place).messages.fetch(rows[deleteIndex].message_id)
                .then((message) => message.delete())
                .catch((error)  => error);
                db.run("delete from delete_messages where message_id = ?", rows[deleteIndex].message_id);
                deleteIndex++;
                break;
  
            }
          }, 5_000);
        }
      });

    }

    // プラチナスターツアー 開演
    bot.get("search/tweets", {q: "プラチナスターツアー 開演 from:imasml_theater -is:retweet -is:reply", count: 1, tweet_mode: "extended"}, (err, tweets, res) => {
      if(tweets){
        if(tweets.statuses[0]){

          db.all("select * from tweet_id_for_star_tour_start", (err, rows) => {
            if(tweets.statuses[0].id !== rows[0].id){

              db.run("update tweet_id_for_star_tour_start set id = ?", tweets.statuses[0].id);

              const EVENT_BEGIN_INDEX   = tweets.statuses[0].full_text.indexOf("イベント楽曲");
              const EVENT_BEGIN_NAME    = tweets.statuses[0].full_text.substr(EVENT_BEGIN_INDEX);
              const EVENT_BEGIN_INDEX_1 = EVENT_BEGIN_NAME.indexOf("『");
              const EVENT_END_INDEX     = EVENT_BEGIN_NAME.indexOf("』");
              const EVENT_NAME          = EVENT_BEGIN_NAME.slice(EVENT_BEGIN_INDEX_1, EVENT_END_INDEX + 1);

              const CARD_INDEX = tweets.statuses[0].full_text.indexOf("【イベント限定カード】");
              const CARD_LIST  = tweets.statuses[0].full_text.substr(CARD_INDEX).slice(0, -6);

              client.channels.cache.get(information.channel_for_test_solo_chat_place).send({content: "本日から" + EVENT_NAME + "のイベントが始まりました！\n\n" + CARD_LIST, files: [tweets.statuses[0].entities.media[0].media_url_https]});

              client.channels.cache.get(information.channel_for_235_chat_place).send({content: "本日から" + EVENT_NAME + "のイベントが始まりました！\n\n" + CARD_LIST, files: [tweets.statuses[0].entities.media[0].media_url_https]});

            }
          });

        }
      }
    });

    // プラチナスターツアー 折り返し
    bot.get("search/tweets", {q: "プラチナスターツアー 折り返し from:imasml_theater -is:retweet -is:reply", count: 1, tweet_mode: "extended"}, (err, tweets, res) => {
      if(tweets){
        if(tweets.statuses[0]){

          db.all("select * from tweet_id_for_star_tour_folding", (err, rows) => {
            if(tweets.statuses[0].id !== rows[0].id){

              db.run("update tweet_id_for_star_tour_folding set id = ?", tweets.statuses[0].id);

              request(information.events_url, (error, response, body) => {
                const latestEvent = body.sort((a, b) => {
                  if(a.id < b.id){
                    return 1;
                  }else{
                    return -1;
                  }
                })[0];

                client.channels.cache.get(information.channel_for_test_solo_chat_place).send({content: "『" + latestEvent.name + "』イベント後半戦になりました！", files: [tweets.statuses[0].entities.media[0].media_url_https]});

                client.channels.cache.get(information.channel_for_235_chat_place).send({content: "『" + latestEvent.name + "』のイベント後半戦になりました！", files: [tweets.statuses[0].entities.media[0].media_url_https]});
              });
            }
          });

        }
      }
    });

    // プラチナスターシアター 開演
    bot.get("search/tweets", {q: "プラチナスターシアター 開演 from:imasml_theater -is:retweet -is:reply", count: 1, tweet_mode: "extended"}, (err, tweets, res) => {
      if(tweets){
        if(tweets.statuses[0]){

          db.all("select * from tweet_id_for_star_theater_start", (err, rows) => {
            if(tweets.statuses[0].id !== rows[0].id){

              db.run("update tweet_id_for_star_theater_start set id = ?", tweets.statuses[0].id);

              const EVENT_BEGIN_INDEX   = tweets.statuses[0].full_text.indexOf("イベント楽曲");
              const EVENT_BEGIN_NAME    = tweets.statuses[0].full_text.substr(EVENT_BEGIN_INDEX);
              const EVENT_BEGIN_INDEX_1 = EVENT_BEGIN_NAME.indexOf("『");
              const EVENT_END_INDEX     = EVENT_BEGIN_NAME.indexOf("』");
              const EVENT_NAME          = EVENT_BEGIN_NAME.slice(EVENT_BEGIN_INDEX_1, EVENT_END_INDEX + 1);

              const CARD_INDEX = tweets.statuses[0].full_text.indexOf("【イベント限定カード】");
              const CARD_LIST  = tweets.statuses[0].full_text.substr(CARD_INDEX).slice(0, -6);

              client.channels.cache.get(information.channel_for_test_solo_chat_place).send({content: "本日から" + EVENT_NAME + "のイベントが始まりました！\n\n" + CARD_LIST, files: [tweets.statuses[0].entities.media[0].media_url_https]});

              client.channels.cache.get(information.channel_for_235_chat_place).send({content: "本日から" + EVENT_NAME + "のイベントが始まりました！\n\n" + CARD_LIST, files: [tweets.statuses[0].entities.media[0].media_url_https]});

            }
          });

        }
      }
    });

    // プラチナスターシアター 折り返し
    bot.get("search/tweets", {q: "プラチナスターシアター 折り返し from:imasml_theater -is:retweet -is:reply", count: 1, tweet_mode: "extended"}, (err, tweets, res) => {
      if(tweets){
        if(tweets.statuses[0]){

          db.all("select * from tweet_id_for_star_theater_folding", (err, rows) => {
            if(tweets.statuses[0].id !== rows[0].id){

              db.run("update tweet_id_for_star_theater_folding set id = ?", tweets.statuses[0].id);

              request(information.events_url, (error, response, body) => {
                const latestEvent = body.sort((a, b) => {
                  if(a.id < b.id){
                    return 1;
                  }else{
                    return -1;
                  }
                })[0];

                client.channels.cache.get(information.channel_for_test_solo_chat_place).send({content: "『" + latestEvent.name + "』イベント後半戦になりました！", files: [tweets.statuses[0].entities.media[0].media_url_https]});

                client.channels.cache.get(information.channel_for_235_chat_place).send({content: "『" + latestEvent.name + "』のイベント後半戦になりました！", files: [tweets.statuses[0].entities.media[0].media_url_https]});
              });
            }
          });

        }
      }
    });

    // 9時にメンバーの誕生日、9時半にミリシタのキャラの誕生日、10時に周年祝い
    // 21時にイベントの終了のお知らせ
    // 22時に当日スタミナドリンクが配られるイベントのドリンクを使ったかの告知など
    if((today_hour === 9) && (today_min === 0)){

      for(let member of birthday_for_235_member.data){
        if((today_month === member.month) && (today_date === member.date)){
          information.today_birthday_for_235_member.push(member.name);
        }
      }

      // 誕生日が1人いた時と複数人いた時
      if(information.today_birthday_for_235_member.length === 1){

        if(client.channels.cache.get(information.channel_for_235_chat_place) !== undefined){
          client.channels.cache.get(information.channel_for_235_chat_place).send("本日" + today_month + "月" + today_date + "日は**" + information.today_birthday_for_235_member[0] + "さん**のお誕生日です！！\n" + information.today_birthday_for_235_member[0] + "さん、お誕生日おめでとうございます♪");
        }

      }else if(information.today_birthday_for_235_member.length > 1){

        let birthday_timer = setInterval(function(){
          if(information.today_birthday_people_for_235_member === information.today_birthday_for_235_member.length){
            clearInterval(birthday_timer);
          }else if(information.today_birthday_people_for_235_member === 0){

            if(client.channels.cache.get(information.channel_for_235_chat_place) !== undefined){
              client.channels.cache.get(information.channel_for_235_chat_place).send("本日" + today_month + "月" + today_date + "日は**" + information.today_birthday_for_235_member[information.today_birthday_people_for_235_member] + "さん**のお誕生日です！！\n" + information.today_birthday_for_235_member[information.today_birthday_people_for_235_member] + "さん、お誕生日おめでとうございます♪");
            }

            information.today_birthday_people_for_235_member++;

          }else{

            if(client.channels.cache.get(information.channel_for_235_chat_place) !== undefined){
              client.channels.cache.get(information.channel_for_235_chat_place).send("さらに！！　本日は**" + information.today_birthday_for_235_member[information.today_birthday_people_for_235_member] + "さん**のお誕生日でもあります！！\n" + information.today_birthday_for_235_member[information.today_birthday_people_for_235_member] + "さん、お誕生日おめでとうございます♪");
            }

            information.today_birthday_people_for_235_member++;

          }
        }, 4_000)  // 4秒ごと
      }

    }else if((today_hour === 9) && (today_min === 30)){

      for(let member of birthday_for_million_member.data){
        if((today_month === member.month) && (today_date === member.date)){
          information.today_birthday_for_million_member.push(member);
        }
      }

      if(information.today_birthday_for_million_member.length === 1){

        if(birthday_for_million_member.validation.includes(information.today_birthday_for_million_member[0].name)){
          if(client.channels.cache.get(information.channel_for_235_chat_place) !== undefined){
            client.channels.cache.get(information.channel_for_235_chat_place).send({content: "本日" + today_month + "月" + today_date + "日は**" + information.today_birthday_for_million_member[0].name + "**さんのお誕生日です！！\nHappy Birthday♪", files: [information.today_birthday_for_million_member[0].img]});
          }
        }else{
          if(client.channels.cache.get(information.channel_for_235_chat_place) !== undefined){
            client.channels.cache.get(information.channel_for_235_chat_place).send({content: "本日" + today_month + "月" + today_date + "日は**" + information.today_birthday_for_million_member[0].name + "**のお誕生日です！！\nHappy Birthday♪", files: [information.today_birthday_for_million_member[0].img]});
          }
        }


      }else if(information.today_birthday_for_million_member.length > 1){

        let birthday_timer = setInterval(function(){
          if(information.today_birthday_people_for_million_member === information.today_birthday_for_million_member.length){
            clearInterval(birthday_timer);
          }else if(information.today_birthday_people_for_million_member === 0){

            if(client.channels.cache.get(information.channel_for_235_chat_place) !== undefined){
              client.channels.cache.get(information.channel_for_235_chat_place).send({content: "本日" + today_month + "月" + today_date + "日は**" + information.today_birthday_for_million_member[information.today_birthday_people_for_million_member].name + "**のお誕生日です！！\nHappy Birthday♪", files: [information.today_birthday_for_million_member[information.today_birthday_people_for_million_member].img]});
            }

            information.today_birthday_people_for_million_member++;

          }else{

            if(client.channels.cache.get(information.channel_for_235_chat_place) !== undefined){
              client.channels.cache.get(information.channel_for_235_chat_place).send({content: "さらに！！　本日は**" + information.today_birthday_for_million_member[information.today_birthday_people_for_million_member].name + "**のお誕生日でもあります！！\nHappy Birthday♪", files: [information.today_birthday_for_million_member[information.today_birthday_people_for_million_member].img]});
            }

            information.today_birthday_people_for_million_member++;

          }
        }, 4_000)  // 4秒ごと

      }

    }else if((today_hour === 10) && (today_min === 0)){

      for(let anniversary_data of information.anniversary_datas){
        if((today_month === anniversary_data.month) && (today_date === anniversary_data.date)){
          if(anniversary_data.name === "235プロダクション"){
            if(client.channels.cache.get(information.channel_for_235_chat_place) !== undefined){
              client.channels.cache.get(information.channel_for_235_chat_place).send("本日" + today_month + "月" + today_date + "日で**" + anniversary_data.name + "**が設立されて**" + Number(today_year - anniversary_data.year) + "年**が経ちました！！\nHappy Birthday♪　これからも235プロがずっと続きますように♪");
            }
          }else{
            if(client.channels.cache.get(information.channel_for_235_chat_place) !== undefined){
              client.channels.cache.get(information.channel_for_235_chat_place).send("本日" + today_month + "月" + today_date + "日で**" + anniversary_data.name + "**は**" + Number(today_year - anniversary_data.year) + "周年**を迎えます！！\nHappy Birthday♪　アイマス最高！！！");
            }
          }
        }
      }

    }else if((today_hour === 22) && (today_min === 0)){
      
      request(information.events_url, (error, response, body) => {
        // 最新イベント取得
        const latestEvent = body.sort((a, b) => {
          if(a.id < b.id){
            return 1;
          }else{
            return -1;
          }
        })[0];

        // イベント開始日
        const eventBegin     = latestEvent.schedule.beginDate.slice(0, -6);
        const eventBeginTime = new Date(eventBegin);
        const beginMonth     = eventBeginTime.getMonth() + 1;
        const beginDate      = eventBeginTime.getDate();

        // イベント終了日
        const eventEnd     = latestEvent.schedule.endDate.slice(0, -6);
        const eventEndTime = new Date(eventEnd);
        const endMonth     = eventEndTime.getMonth() + 1;
        const endDate      = eventEndTime.getDate();

        switch(latestEvent.type){

          case 1:  // THEATER SHOW TIME☆
  
            //
            break;
  
          case 2:  // ミリコレ！
  
            //
            break;
  
          case 3:  // プラチナスターシアター・トラスト
  
            //
            break;
  
          case 4:  // プラチナスターツアー
  
            //
            break;
  
          case 5:  // 周年記念イベント
  
            //
            break;
  
          case 6:  // MILLION LIVE WORKING☆
  
            //
            break;
  
          case 7:  // エイプリルフール
  
            //
            break;
  
          case 9:  // ミリコレ！（ボックスガシャ）
  
            //
            break;
  
          case 10:  // ツインステージ
  
            //
            break;
  
          case 11:  // プラチナスターチューン
  
            //
            break;
  
          case 12:  // ツインステージ2
  
            //
            break;
  
          case 13:  // プラチナスターテール
  
            //
            break;
  
          case 14:  // THEATER TALK PARTY☆
  
            //
            break;
  
          case 16:  // プラチナスタートレジャー
  
            //
            break;
  
        }
      });

    }
  }, 60_000);  // 1分ごと
});

// スラッシュコマンドが使われた時に行う処理
client.on("interactionCreate", interaction => {
  if(!interaction.isCommand()) return;

  if(interaction.commandName === "235ap"){

    interaction.reply("235apコマンドを使用することで、" + interaction.user.username + "さんがAPすることが出来た曲を登録することが出来ます。\nなお、もしまだ" + interaction.user.username + "さんが235apコマンドを使用したことがない場合、まずはAP曲データを登録する必要があるので、235ap と入力をして、AP曲データを登録してください。\n登録してからは、235ap 真夏のダイヤ☆ など、APすることが出来た曲名を入力することによって、入力された曲を登録することが出来ます！\n※入力することが出来る曲は1曲だけです。また、曲名はフルで入力する必要があります。2曲以上入力しているか、もしくはフルで入力することが出来ていない場合、登録することが出来ないので注意してください！");
    setTimeout(() => interaction.deleteReply() , 180_000);

  }else if(interaction.commandName === "235apremove"){

    interaction.reply("235apremoveコマンドを使用することで、間違ってAP曲データに登録してしまった曲を取り消すことが出来ます。\n※入力することが出来る曲は1曲だけです。また、曲名はフルで入力する必要があります。2曲以上入力しているか、もしくはフルで入力することが出来ていない場合、登録することが出来ないので注意してください！");
    setTimeout(() => interaction.deleteReply() , 180_000);

  }else if(interaction.commandName === "235apall"){

    interaction.reply("235apallコマンドを使用することで、" + interaction.user.username + "さんが今までAPしてきた曲と曲数を知ることが出来ます。\nなお、もしまだ" + interaction.user.username + "さんが235apコマンドを使用したことがない場合、まずはAP曲データを登録する必要があるので、235ap と入力をして、AP曲データを登録してください。\n登録してからは、235ap 真夏のダイヤ☆ など、APすることが出来た曲名を入力することによって、入力された曲を登録することが出来ます！\n曲数をタイプで絞りたい場合、235apall Fairy のように入力することで、入力されたタイプでAPしてきた曲と曲数を知ることが出来ます。\n（絞ることが出来るタイプの数は**1つ**だけです！）");
    setTimeout(() => interaction.deleteReply() , 180_000);

  }else if(interaction.commandName === "235notap"){

    interaction.reply("235notapコマンドを使用することで、" + interaction.user.username + "さんがまだAP出来ていない曲と曲数を知ることが出来ます。\nなお、もしまだ" + interaction.user.username + "さんが235apコマンドを使用したことがない場合、まずはAP曲データを登録する必要があるので、235ap と入力をして、AP曲データを登録してください。\n登録してからは、235ap 真夏のダイヤ☆ など、APすることが出来た曲名を入力することによって、入力された曲を登録することが出来ます！\n曲数をタイプで絞りたい場合、235apall Fairy のように入力することで、入力されたタイプでAP出来ていない曲と曲数を知ることが出来ます。\n（絞ることが出来るタイプの数は**1つ**だけです！）");
    setTimeout(() => interaction.deleteReply() , 180_000);

  }else if(interaction.commandName === "235apsearch"){

    interaction.reply("235apsearchコマンドを使用することで、" + interaction.user.username + "さんが入力した曲が既にAP出来ているか知ることが出来ます。\nなお、もしまだ" + interaction.user.username + "さんが235apコマンドを使用したことがない場合、まずはAP曲データを登録する必要があるので、235ap と入力をして、AP曲データを登録してください。\n登録してからは、235ap 真夏のダイヤ☆ など、APすることが出来た曲名を入力することによって、入力された曲を登録することが出来ます！\n※入力することが出来る曲は1曲だけです。また、曲名はフルで入力する必要があります。2曲以上入力しているか、もしくはフルで入力することが出来ていない場合、登録することが出来ないので注意してください！");
    setTimeout(() => interaction.deleteReply() , 180_000);

  }else if(interaction.commandName === "235birthday"){

    switch(interaction.user.username){
      case "うたたねさん":

        interaction.reply("235birthdayコマンドを使用することで、毎月開催されるオンライン飲み会の企画文章を作成することが出来ます。コマンドを使用するときは、開催したい月、日程、時間の**3つ**を**半角数字のみ**、**半角スペースで区切って**入力してください。\n\n235birthday 12 14 21");
        setTimeout(() => interaction.deleteReply() , 180_000);
        break;

      default:

        interaction.reply("235birthday コマンドは、ラウンジマスターである**うたたねさん**だけが使用出来るコマンドです。");
        setTimeout(() => interaction.deleteReply() , 180_000);
        break;

    }

  }else if(interaction.commandName === "235men"){

    switch(interaction.user.username){
      case "うたたねさん":

        interaction.reply("235menコマンドを使用することで、毎月開催される235士官学校🌹の日程を決める文章を作成することが出来ます。コマンドを使用するときは、開催したい日程を**2～10個**、**半角数字のみ**で入力してください。\n\n235mendate 12 14 16 17");
        setTimeout(() => interaction.deleteReply() , 180_000);
        break;

      default:

        interaction.reply("235men コマンドは、ラウンジマスターである**うたたねさん**だけが使用出来るコマンドです。");
        setTimeout(() => interaction.deleteReply() , 180_000);
        break;

    }

  }else if(interaction.commandName === "235roomdivision"){

    interaction.reply("235roomdivisionコマンドを使用することで、雑談ボイスチャンネルに参加しているメンバーが10以上になったときに、部屋を分けることが出来ます。\nなお、雑談ボイスチャンネルに参加しているメンバーが**10人未満**のときは分けることが出来ません。また、235roomdivisionコマンドは、雑談ボイスチャンネルに参加しているメンバーのみが使用できます。");
    setTimeout(() => interaction.deleteReply() , 180_000);

  }

});

// メッセージが送信された時に行う処理
client.on("messageCreate", message => {
  // イベント企画の文章作成機能でアクションを付ける必要がある235botのメッセージだけは反応する
  db.all("select * from emojis", (err, rows) => {
    if(err){
      console.log(err);
    }else{
      if(rows.length === 1){
        for(let i = 0; i < rows[0].count; i++){
          message.react(information.emojis[i]);
        }

        // emojisテーブル初期化
        db.run("delete from emojis");
      }
    }
  });

  // 235botのメッセージがリプライだった場合、1分後に削除する
  if((message.author.bot) && (message.mentions.repliedUser)){
    setTimeout(function(){message.delete();}, 60_000);
  };

  // 雑談場（通話外）の235botのリプライじゃないメッセージを保存（１週間後に消すため）
  if(client.channels.cache.get(information.channel_for_235_chat_place) !== undefined){

    if((message.channelId === information.channel_for_235_chat_place) && (message.author.bot) && (message.mentions.repliedUser === null)){
      const now  = new Date();
      const date = now.getDate();

      db.run("insert into delete_messages(message_id, date) values(?, ?)", message.id, date);
    }

  }

  // botからのメッセージは無視
  if(message.author.bot) return;

  // コマンドメッセージ以外は無視
  if(!message.content.startsWith(information.prefix)) return;

  const msg     = message.content.slice(information.prefix.length);  // 235の文字だけ削除
  const data    = msg.split(" ");                                    // コマンド以外の文字があったらそれを配列で取得
  const command = data.shift().toLowerCase();                        // コマンド内容を小文字で取得


  if(command === "ap"){                  // apコマンド このコマンドを初めて使った人のAP曲データ登録、APした曲をデータに登録する。
    // apコマンドのみの場合 初めて使った人ならAP曲データ登録、2度目以降なら曲名入れてね警告する。
    if(data.length === 0){

      let names = message.author.username.split("");
      
      for(let i = 0; i < names.length; i++){
        if(information.escapes.includes(names[i])) names[i] = "";
      }

      names = names.join("");

      db.all("select " + names + "_flg" + " from APmusics where " + names + "_flg = 1", (err, rows) => {
        if(err){

          db.run("alter table APmusics add column " + names + "_flg default 0");

          message.reply("今回" + message.author.username + "さんは初めて235apコマンドを使ったので、新しく" + message.author.username + "さんのAP曲データを登録しました！\nAPすることが出来たら、235ap DIAMOND のようにコマンドを使って、どんどんAPすることが出来た曲を登録していきましょう！\n※曲名はフルで入力してください！（フルで入力することが出来ていなかったり、2曲以上入力している場合、登録することが出来ません。）");
          setTimeout(() => {
            message.delete()
            .then((data) => data)
            .catch((err) => err);
          }, information.message_delete_time);

        }else{

          message.reply(message.author.username + "さんは既にAP曲データが登録されています！ APすることが出来た曲を登録したい場合、235ap DIAMOND のようにコマンドを使って登録してください！\n※曲名はフルで入力してください！（フルで入力することが出来ていなかったり、2曲以上入力している場合、登録することが出来ません。）");
          setTimeout(() => {
            message.delete()
            .then((data) => data)
            .catch((err) => err);
          }, information.message_delete_time);

        }
      });

    }else{

      let names = message.author.username.split("");
      
      for(let i = 0; i < names.length; i++){
        if(information.escapes.includes(names[i])) names[i] = "";
      }

      names = names.join("");

      const musics    = msg.slice(3).split("^");

      db.all("select name, " + names + "_flg" + " from APmusics", (err, rows) => {
        // コマンドを打ってきた人がまだカラムを登録してなかったらカラムを登録して曲を追加
        if(err){

          db.run("alter table APmusics add column " + names + "_flg default 0");

          let min   = 0xFFFF;
          let suggest_music = "";

          for(let row of rows){
              if(min > def.levenshteinDistance(def.hiraToKana(musics[0]).toUpperCase(), def.hiraToKana(row.name).toUpperCase())){
                  min   = def.levenshteinDistance(def.hiraToKana(musics[0]).toUpperCase(), def.hiraToKana(row.name).toUpperCase());
                  suggest_music = row.name;
              }
          }

          for(let music of musics){
            db.all("select * from APmusics where name = ?", music, (err, rows) => {
              if(err){
                console.log(err);
              }else{
                if(rows.length === 0){

                  if(min <= 1){

                    db.all("select * from APmusics where name = ?", suggest_music, (err, results) => {
                      if(results[0][names + "_flg"] === 1){

                        message.reply(results[0].name + " は既に登録されています！");
                        setTimeout(() => {
                          message.delete()
                          .then((data) => data)
                          .catch((err) => err);
                        }, information.message_delete_time);

                      }else{

                        db.run("update APmusics set " + names + "_flg = 1 where name = ?", suggest_music);
                        message.reply("登録成功：" + suggest_music + "\nAPおめでとうございます♪");
                        setTimeout(() => {
                          message.delete()
                          .then((data) => data)
                          .catch((err) => err);
                        }, information.message_delete_time);

                      }
                    });

                  }else if((min > 1) && (min < 6)){

                    message.reply("登録に失敗しました......\n\nこちらのコマンドを試してみてはいかがでしょうか？　235ap " + suggest_music);
                    setTimeout(() => {
                      message.delete()
                      .then((data) => data)
                      .catch((err) => err);
                    }, information.message_delete_time);

                  }else{

                    message.reply("登録に失敗しました......\n正しく曲名を**フル**で入力できているか、もしくは**2曲以上入力していないか**確認してください！");
                    setTimeout(() => {
                      message.delete()
                      .then((data) => data)
                      .catch((err) => err);
                    }, information.message_delete_time);

                  }
                }else{

                  if(rows[0][names + "_flg"] === 1){

                    message.reply(rows[0].name + " は既に登録されています！");
                    setTimeout(() => {
                      message.delete()
                      .then((data) => data)
                      .catch((err) => err);
                    }, information.message_delete_time);

                  }else{

                    db.run("update APmusics set " + names + "_flg = 1 where name = ?", music);
                    message.reply("登録成功：" + music + "\nAPおめでとうございます♪");
                    setTimeout(() => {
                      message.delete()
                      .then((data) => data)
                      .catch((err) => err);
                    }, information.message_delete_time);

                  }

                }
              }
            });
          }

        }else{

          let min   = 0xFFFF;
          let suggest_music = "";

          for(let row of rows){
              if(min > def.levenshteinDistance(def.hiraToKana(musics[0]).toUpperCase(), def.hiraToKana(row.name).toUpperCase())){
                  min   = def.levenshteinDistance(def.hiraToKana(musics[0]).toUpperCase(), def.hiraToKana(row.name).toUpperCase());
                  suggest_music = row.name;
              }
          }

          for(let music of musics){
            db.all("select * from APmusics where name = ?", music, (err, rows) => {
              if(err){
                console.log(err);
              }else{
                if(rows.length === 0){

                  if(min <= 1){

                    db.all("select * from APmusics where name = ?", suggest_music, (err, results) => {
                      if(results[0][names + "_flg"] === 1){

                        message.reply(results[0].name + " は既に登録されています！");
                        setTimeout(() => {
                          message.delete()
                          .then((data) => data)
                          .catch((err) => err);
                        }, information.message_delete_time);

                      }else{

                        db.run("update APmusics set " + names + "_flg = 1 where name = ?", suggest_music);
                        message.reply("登録成功：" + suggest_music + "\nAPおめでとうございます♪");
                        setTimeout(() => {
                          message.delete()
                          .then((data) => data)
                          .catch((err) => err);
                        }, information.message_delete_time);

                      }
                    });

                  }else if((min > 1) && (min < 6)){

                    message.reply("登録に失敗しました......\n\nこちらのコマンドを試してみてはいかがでしょうか？　235ap " + suggest_music);
                    setTimeout(() => {
                      message.delete()
                      .then((data) => data)
                      .catch((err) => err);
                    }, information.message_delete_time);

                  }else{

                    message.reply("登録に失敗しました......\n正しく曲名を**フル**で入力できているか、もしくは**2曲以上入力していないか**確認してください！");
                    setTimeout(() => {
                      message.delete()
                      .then((data) => data)
                      .catch((err) => err);
                    }, information.message_delete_time);

                  }
                }else{

                  if(rows[0][names + "_flg"] === 1){

                    message.reply(rows[0].name + " は既に登録されています！");
                    setTimeout(() => {
                      message.delete()
                      .then((data) => data)
                      .catch((err) => err);
                    }, information.message_delete_time);

                  }else{

                    db.run("update APmusics set " + names + "_flg = 1 where name = ?", music);
                    message.reply("登録成功：" + music + "\nAPおめでとうございます♪");
                    setTimeout(() => {
                      message.delete()
                      .then((data) => data)
                      .catch((err) => err);
                    }, information.message_delete_time);

                  }

                }
              }
            });
          }

        }

      });

    }

  }else if(command === "apremove"){      // apremoveコマンド 間違ってAP曲データに登録してしまった曲を取り消す。

    if(data.length === 0){

      message.reply("235apremoveコマンドを使用する場合は、曲名を1曲フルで入力してください！");
      setTimeout(() => {
        message.delete()
        .then((data) => data)
        .catch((err) => err);
      }, information.message_delete_time);

    }else{

      let names = message.author.username.split("");
      
      for(let i = 0; i < names.length; i++){
        if(information.escapes.includes(names[i])) names[i] = "";
      }

      names = names.join("");

      const musics    = msg.slice(9).split("^");

      db.all("select name, " + names + "_flg" + " from APmusics", (err, rows) => {
        // コマンドを打ってきた人がまだカラムを登録してなかったらapコマンド使うように警告
        if(err){

          message.reply("まだ" + message.author.username + "さんのAP曲データが登録されていないようです......\nまずは 235ap コマンドを使って" + message.author.username + "さんのAP曲データを登録してからAPすることが出来た曲を登録してください！");
          setTimeout(() => {
            message.delete()
            .then((data) => data)
            .catch((err) => err);
          }, information.message_delete_time);

        }else{

          let min   = 0xFFFF;
          let suggest_music = "";

          for(let row of rows){
              if(min > def.levenshteinDistance(def.hiraToKana(musics[0]).toUpperCase(), def.hiraToKana(row.name).toUpperCase())){
                  min   = def.levenshteinDistance(def.hiraToKana(musics[0]).toUpperCase(), def.hiraToKana(row.name).toUpperCase());
                  suggest_music = row.name;
              }
          }

          for(let music of musics){
            db.all("select * from APmusics where name = ?", music, (err, rows) => {
              if(err){
                console.log(err);
              }else{
                if(rows.length === 0){

                  if(min <= 1){

                    db.all("select * from APmusics where name = ?", suggest_music, (err, results) => {
                      if(results[0][names + "_flg"] === 0){

                        message.reply(results[0].name + " はまだAP曲データに登録されていないようです。");
                        setTimeout(() => {
                          message.delete()
                          .then((data) => data)
                          .catch((err) => err);
                        }, information.message_delete_time);

                      }else{

                        db.run("update APmusics set " + names + "_flg = 0 where name = ?", suggest_music);
                        message.reply("取り消し成功：" + suggest_music);
                        setTimeout(() => {
                          message.delete()
                          .then((data) => data)
                          .catch((err) => err);
                        }, information.message_delete_time);

                      }
                    });

                  }else if((min > 1) && (min < 6)){

                    message.reply("取り消しに失敗しました......\n\nこちらのコマンドを試してみてはいかがでしょうか？　235ap " + suggest_music);
                    setTimeout(() => {
                      message.delete()
                      .then((data) => data)
                      .catch((err) => err);
                    }, information.message_delete_time);

                  }else{

                    message.reply("取り消しに失敗しました......\n正しく曲名を**フル**で入力できているか、もしくは**2曲以上入力していないか**確認してください！");
                    setTimeout(() => {
                      message.delete()
                      .then((data) => data)
                      .catch((err) => err);
                    }, information.message_delete_time);

                  }
                }else{

                  if(rows[0][names + "_flg"] === 0){

                    message.reply(rows[0].name + " はまだAP曲データに登録されていないようです。");
                    setTimeout(() => {
                      message.delete()
                      .then((data) => data)
                      .catch((err) => err);
                    }, information.message_delete_time);

                  }else{

                    db.run("update APmusics set " + names + "_flg = 0 where name = ?", music);
                    message.reply("取り消し成功：" + music);
                    setTimeout(() => {
                      message.delete()
                      .then((data) => data)
                      .catch((err) => err);
                    }, information.message_delete_time);

                  }

                }
              }
            });
          }

        }

      });

    }

  }else if(command === "apall"){         // apallコマンド 今までAPしてきた曲一覧を教える。

    if(data.length === 0){

      let names = message.author.username.split("");
      
      for(let i = 0; i < names.length; i++){
        if(information.escapes.includes(names[i])) names[i] = "";
      }

      names = names.join("");

      db.all("select name, " + names + "_flg" + " from APmusics where " + names + "_flg = 1", (err, rows) => {
        // コマンドを打ってきた人がまだカラムを登録してなかったらapコマンド使うように警告
        if(err){

          message.reply("まだ" + message.author.username + "さんのAP曲データが登録されていないようです......\nまずは 235ap コマンドを使って" + message.author.username + "さんのAP曲データを登録してからAPすることが出来た曲を登録してください！");
          setTimeout(() => {
            message.delete()
            .then((data) => data)
            .catch((err) => err);
          }, information.message_delete_time);

        }else{

          // まだ1曲もAPしてないかどうか
          if(rows.length === 0){

            message.reply(message.author.username + "さんはまだ今までAPしてきた曲はないようです。\nもしまだAPした曲を登録していない場合、235ap DIAMOND のようにコマンドを使って登録してください！\n※曲名はフルで入力してください！（フルで入力することが出来ていなかったり、2曲以上入力している場合、登録することが出来ません。）");
            setTimeout(() => {
              message.delete()
              .then((data) => data)
              .catch((err) => err);
            }, information.message_delete_time);

          }else{

            let musicNames  = rows.map((item) => {return item.name});
            let sliceMusics = def.sliceByNumber(musicNames, 100);
            let count       = 0;
            let text        = "";

            if(sliceMusics.length === 1){

              text = sliceMusics[count].join("\n");
              message.reply("AP曲\n\n" + text + "\n\n合計" + rows.length + "曲");
              setTimeout(() => {
                message.delete()
                .then((data) => data)
                .catch((err) => err);
              }, information.message_delete_time);

            }else{

              text = sliceMusics[count].join("\n");
              message.reply("AP曲\n\n" + text);
              count++;

              let text_timer = setInterval(() => {
                if(count === sliceMusics.length){

                  message.delete()
                  .then((data) => data)
                  .catch((err) => err);
                  clearInterval(text_timer);

                }else{

                  text = sliceMusics[count].join("\n");

                  if(count === sliceMusics.length - 1){

                    message.reply(text + "\n\n合計" + rows.length + "曲");

                  }else{

                    message.reply(text);

                  }

                  count++;
                }
              }, 3_000);

            }

          }
        }
      });

    }else if(data.length === 1){

      let names = message.author.username.split("");
      
      for(let i = 0; i < names.length; i++){
        if(information.escapes.includes(names[i])) names[i] = "";
      }

      names = names.join("");

      // タイプ以外の文字が入力されてたら警告
      let check             = false;

      for(let i = 0; i < information.types.length; i++){
        if(data[0].toUpperCase().startsWith(information.check_types[i])){
          data[0] = information.types[i];
        }
      }

      if(!def.isIncludes(["All", "Princess", "Angel", "Fairy"], data[0])){
        check = true;
      }

      if(check){

        message.reply("入力された文字の中にタイプ名じゃない文字が入っています！\n正しいタイプ名(All, Princess, Fairy, Angel)を入力してください！\n\n235apall All");
        setTimeout(() => {
          message.delete()
          .then((data) => data)
          .catch((err) => err);
        }, information.message_delete_time);

      }else{

        db.all("select name, " + names + "_flg" + " from APmusics where " + names + "_flg = 1 and type = ?", data[0], (err, rows) => {
          // コマンドを打ってきた人がまだカラムを登録してなかったらapコマンド使うように警告
          if(err){
  
            message.reply("まだ" + message.author.username + "さんのAP曲データが登録されていないようです......\nまずは 235ap コマンドを使って" + message.author.username + "さんのAP曲データを登録してからAPすることが出来た曲を登録してください！");
            setTimeout(() => {
              message.delete()
              .then((data) => data)
              .catch((err) => err);
            }, information.message_delete_time);
  
          }else{
  
            // まだ1曲もAPしてないかどうか
            if(rows.length === 0){
  
              message.reply(message.author.username + "さんはまだ" + data[0] + "曲で今までAPしてきた曲はないようです。\nもしまだAPした曲を登録していない場合、235ap DIAMOND のようにコマンドを使って登録してください！\n※曲名はフルで入力してください！（フルで入力することが出来ていなかったり、2曲以上入力している場合、登録することが出来ません。）");
              setTimeout(() => {
                message.delete()
                .then((data) => data)
                .catch((err) => err);
              }, information.message_delete_time);
  
            }else{

              let musicNames  = rows.map((item) => {return item.name});
              let sliceMusics = def.sliceByNumber(musicNames, 100);
              let count       = 0;
              let text        = "";

              if(sliceMusics.length === 1){

                text = sliceMusics[count].join("\n");
                message.reply(data[0] + " AP曲\n\n" + text + "\n\n合計" + rows.length + "曲");
                setTimeout(() => {
                  message.delete()
                  .then((data) => data)
                  .catch((err) => err);
                }, information.message_delete_time);

              }else{

                text = sliceMusics[count].join("\n");
                message.reply(data[0] + " AP曲\n\n" + text);
                count++;

                let text_timer = setInterval(() => {
                  if(count === sliceMusics.length){

                    message.delete()
                    .then((data) => data)
                    .catch((err) => err);
                    clearInterval(text_timer);

                  }else{

                    text = sliceMusics[count].join("\n");

                    if(count === sliceMusics.length - 1){

                      message.reply(text + "\n\n合計" + rows.length + "曲");

                    }else{

                      message.reply(text);

                    }

                    count++;
                  }
                }, 3_000);

              }
  
            }
          }
        });

      }
    }else{
      message.reply("入力された内容が多すぎます！ 絞ることができるタイプの数は**1つだけ**です！\n\n235apall Angel");
      setTimeout(() => {
        message.delete()
        .then((data) => data)
        .catch((err) => err);
      }, information.message_delete_time);
    }

  }else if(command === "notap"){         // notapコマンド まだAPしてない曲一覧を教える。

    if(data.length === 0){

      let names = message.author.username.split("");
      
      for(let i = 0; i < names.length; i++){
        if(information.escapes.includes(names[i])) names[i] = "";
      }

      names = names.join("");

      db.all("select name, " + names + "_flg" + " from APmusics where " + names + "_flg = 0", (err, rows) => {
        // コマンドを打ってきた人がまだカラムを登録してなかったらapコマンド使うように警告
        if(err){

          message.reply("まだ" + message.author.username + "さんのAP曲データが登録されていないようです......\nまずは 235ap コマンドを使って" + message.author.username + "さんのAP曲データを登録してからAPすることが出来た曲を登録してください！");
          setTimeout(() => {
            message.delete()
            .then((data) => data)
            .catch((err) => err);
          }, information.message_delete_time);

        }else{

          // まだ1曲もAPしてないかどうか
          if(rows.length === 0){

            message.reply(message.author.username + "さんはもう既に全ての曲をAPすることが出来ています！\nおめでとうございます♪");
            setTimeout(() => {
              message.delete()
              .then((data) => data)
              .catch((err) => err);
            }, information.message_delete_time);

          }else{

            let musicNames  = rows.map((item) => {return item.name});
            let sliceMusics = def.sliceByNumber(musicNames, 100);
            let count       = 0;
            let text        = "";

            if(sliceMusics.length === 1){

              text = sliceMusics[count].join("\n");
              message.reply("AP未達成曲\n\n" + text + "\n\n合計" + rows.length + "曲");
              setTimeout(() => {
                message.delete()
                .then((data) => data)
                .catch((err) => err);
              }, information.message_delete_time);

            }else{

              text = sliceMusics[count].join("\n");
              message.reply("AP未達成曲\n\n" + text);
              count++;

              let text_timer = setInterval(() => {
                if(count === sliceMusics.length){

                  message.delete()
                  .then((data) => data)
                  .catch((err) => err);
                  clearInterval(text_timer);

                }else{

                  text = sliceMusics[count].join("\n");

                  if(count === sliceMusics.length - 1){

                    message.reply(text + "\n\n合計" + rows.length + "曲");

                  }else{

                    message.reply(text);

                  }

                  count++;
                }
              }, 3_000);

            }

          }
        }
      });
    }else if(data.length === 1){

      let names = message.author.username.split("");
      
      for(let i = 0; i < names.length; i++){
        if(information.escapes.includes(names[i])) names[i] = "";
      }

      names = names.join("");

      // タイプ以外の文字が入力されてたら警告
      let check             = false;

      for(let i = 0; i < information.types.length; i++){
        if(data[0].toUpperCase().startsWith(information.check_types[i])){
          data[0] = information.types[i];
        }
      }

      if(!def.isIncludes(["All", "Princess", "Angel", "Fairy"], data[0])){
        check = true;
      }

      if(check){

        message.reply("入力された文字の中にタイプ名じゃない文字が入っています！\n正しいタイプ名(All, Princess, Fairy, Angel)を入力してください！\n\n235apall All");
        setTimeout(() => {
          message.delete()
          .then((data) => data)
          .catch((err) => err);
        }, information.message_delete_time);

      }else{

        db.all("select name, " + names + "_flg" + " from APmusics where " + names + "_flg = 0 and type = ?", data[0], (err, rows) => {
          // コマンドを打ってきた人がまだカラムを登録してなかったらapコマンド使うように警告
          if(err){
  
            message.reply("まだ" + message.author.username + "さんのAP曲データが登録されていないようです......\nまずは 235ap コマンドを使って" + message.author.username + "さんのAP曲データを登録してからAPすることが出来た曲を登録してください！");
            setTimeout(() => {
              message.delete()
              .then((data) => data)
              .catch((err) => err);
            }, information.message_delete_time);
  
          }else{
  
            // まだ1曲もAPしてないかどうか
            if(rows.length === 0){
  
              message.reply(message.author.username + "さんはもう既に全ての曲をAPすることが出来ています！\nおめでとうございます♪");
              setTimeout(() => {
                message.delete()
                .then((data) => data)
                .catch((err) => err);
              }, information.message_delete_time);
  
            }else{

              let musicNames  = rows.map((item) => {return item.name});
              let sliceMusics = def.sliceByNumber(musicNames, 100);
              let count       = 0;
              let text        = "";

              if(sliceMusics.length === 1){

                text = sliceMusics[count].join("\n");
                message.reply(data[0] + " AP未達成曲\n\n" + text + "\n\n合計" + rows.length + "曲");
                setTimeout(() => {
                  message.delete()
                  .then((data) => data)
                  .catch((err) => err);
                }, information.message_delete_time);

              }else{

                text = sliceMusics[count].join("\n");
                message.reply(data[0] + " AP未達成曲\n\n" + text);
                count++;

                let text_timer = setInterval(() => {
                  if(count === sliceMusics.length){

                    message.delete()
                    .then((data) => data)
                    .catch((err) => err);
                    clearInterval(text_timer);

                  }else{

                    text = sliceMusics[count].join("\n");

                    if(count === sliceMusics.length - 1){

                      message.reply(text + "\n\n合計" + rows.length + "曲");

                    }else{

                      message.reply(text);

                    }

                    count++;
                  }
                }, 3_000);

              }
  
            }
          }
        });

      }
    }else{
      message.reply("入力された内容が多すぎます！ 絞ることができるタイプの数は**1つだけ**です！\n\n235apall Angel");
      setTimeout(() => {
        message.delete()
        .then((data) => data)
        .catch((err) => err);
      }, information.message_delete_time);
    }

  }else if(command === "apsearch"){      // apsearchコマンド 指定された曲がAPしてあるかどうか教える。

    if(data.length === 0){

      message.reply("曲名が入力されていません！ 235apsearch DIAMOND のように曲名を入力してください！\n※曲名はフルで入力してください！（フルで入力することが出来ていなかったり、2曲以上入力している場合、見つけることが出来ません。）");
      setTimeout(() => {
        message.delete()
        .then((data) => data)
        .catch((err) => err);
      }, information.message_delete_time);

    }else{

      const musics    = msg.slice(9).split("^");

      let names = message.author.username.split("");
      
      for(let i = 0; i < names.length; i++){
        if(information.escapes.includes(names[i])) names[i] = "";
      }

      names = names.join("");

      let text = "";

      db.all("select name, " + names + "_flg from APmusics", (err, rows) => {
        if(err){

          text += "まだ" + message.author.username + "さんのAP曲データが登録されていないようです......\nまずは 235ap コマンドを使って" + message.author.username + "さんのAP曲データを登録してからAPすることが出来た曲を登録してください！";

          message.reply(text);
          setTimeout(() => {
            message.delete()
            .then((data) => data)
            .catch((err) => err);
          }, information.message_delete_time);

        }else{

          let min   = 0xFFFF;
          let suggest_music = "";

          for(let row of rows){
              if(min > def.levenshteinDistance(def.hiraToKana(musics[0]).toUpperCase(), def.hiraToKana(row.name).toUpperCase())){
                  min   = def.levenshteinDistance(def.hiraToKana(musics[0]).toUpperCase(), def.hiraToKana(row.name).toUpperCase());
                  suggest_music = row.name;
              }
          }

          for(let music of musics){
            db.all("select * from APmusics where name = ?", music, (err, rows) => {
              if(rows.length === 0){

                if(min <= 1){

                  db.all("select * from APmusics where name = ?", suggest_music, (err, rows) => {

                    if(rows[0][names + "_flg"] === 1){
  
                      message.reply(suggest_music + " は既にAPすることが出来ています！");
                      setTimeout(() => {
                        message.delete()
                        .then((data) => data)
                        .catch((err) => err);
                      }, information.message_delete_time);
    
                    }else{
    
                      message.reply(suggest_music + " はまだAP出来ていません！");
                      setTimeout(() => {
                        message.delete()
                        .then((data) => data)
                        .catch((err) => err);
                      }, information.message_delete_time);
    
                    }

                  });

                }else if((min > 1) && (min < 6)){

                  message.reply("曲名を見つけることが出来ませんでした......\n\nこちらのコマンドを試してみてはいかがでしょうか？　235apsearch " + suggest_music);
                  setTimeout(() => {
                    message.delete()
                    .then((data) => data)
                    .catch((err) => err);
                  }, information.message_delete_time);

                }else{

                  message.reply("曲名を見つけることが出来ませんでした......\n正しく曲名を**フル**で入力できているか、もしくは**2曲以上入力していないか**どうか確認してみてください！");
                  setTimeout(() => {
                    message.delete()
                    .then((data) => data)
                    .catch((err) => err);
                  }, information.message_delete_time);

                }

              }else{
                if(rows[0][names + "_flg"] === 1){

                  message.reply(rows[0].name + " は既にAPすることが出来ています！");
                  setTimeout(() => {
                    message.delete()
                    .then((data) => data)
                    .catch((err) => err);
                  }, information.message_delete_time);

                }else{

                  message.reply(rows[0].name + " はまだAP出来ていません！");
                  setTimeout(() => {
                    message.delete()
                    .then((data) => data)
                    .catch((err) => err);
                  }, information.message_delete_time);

                }
              }
            });
          }

        }
      });

    }

  }else if(command === "help"){          // helpコマンド 235botの機能一覧を教える。

    switch(message.author.username){
      case "うたたねさん":

        message.reply("235botは以下のようなコマンドを使用することが出来ます。\n\n・235ap\n\n・235apremove\n\n・235apall\n\n・235notap\n\n・235apsearch\n\n・235birthday\n\n・235men\n\n・235roomdivision\n\n各コマンドの機能の詳細を知りたい場合は、スラッシュコマンド **/** を使って知りたい機能を選択してください。");
        setTimeout(() => {
          message.delete()
          .then((data) => data)
          .catch((err) => err);
        }, information.message_delete_time);
        break;

      default:

        message.reply("235botは以下のようなコマンドを使用することが出来ます。\n\n・235ap\n\n・235apremove\n\n・235apall\n\n・235notap\n\n・235apsearch\n\n・235roomdivision\n\n各コマンドの機能の詳細を知りたい場合は、スラッシュコマンド **/** を使って知りたい機能を選択してください。");
        setTimeout(() => {
          message.delete()
          .then((data) => data)
          .catch((err) => err);
        }, information.message_delete_time);
        break;

    }

  }else if(command === "birthday"){      // birthdayコマンド 毎月の誕生日祝い企画文章を作成

    // うたたねさん以外は使えないように
    if(message.author.username !== "うたたねさん"){

      message.reply("235birthday コマンドは、ラウンジマスターである**うたたねさん**だけが使用出来るコマンドです。");
      setTimeout(() => {
        message.delete()
        .then((data) => data)
        .catch((err) => err);
      }, information.message_delete_time);

    }else{

      if((data.length < 3) || (data.length > 3)){
  
        message.reply("235birthdayコマンドを使う場合、birthdayの後にオンライン飲み会を開催したい月、日、時間 （半角数字のみ、曜日は不要） の3つを入力してください。\n※半角スペースで区切るのを忘れずに！！\n\n235birthday 8 15 21");
        setTimeout(() => {
          message.delete()
          .then((data) => data)
          .catch((err) => err);
        }, information.message_delete_time);
  
      }else{
  
        let int_check = true;
  
        for(let check of data){
          if(!Number.isInteger(Number(check))){
            int_check = false;
          }
        }
  
        if(!int_check){
  
          message.reply("半角数字以外が含まれています！\n月、日、時間は全て**半角数字のみ**で入力してください！");
          setTimeout(() => {
            message.delete()
            .then((data) => data)
            .catch((err) => err);
          }, information.message_delete_time);
  
        }else{
          if((Number(data[0]) >= 1) && (Number(data[0]) <= 12)){
            let last_date_check = new Date();
            let last_date_month = new Date(last_date_check.getFullYear(), last_date_check.getMonth() + 1, 0);  // 今月末を取得
            let last_date       = last_date_month.getDate();                                // 今月末日
  
            if((Number(data[1]) >= 1) && (Number(data[1]) <= last_date)){
              if((Number(data[2]) >= 0) && (Number(data[2]) <= 23)){
                const dayArray = ["日曜日", "月曜日", "火曜日", "水曜日", "木曜日", "金曜日", "土曜日"];
        
                // 指定された日の曜日を取得
                let now      = new Date();
                let year     = now.getFullYear();
                let month    = Number(data[0]);
                let eventDay = new Date(year, month - 1, Number(data[1]));
                let dayIndex = eventDay.getDay();
                let text     = "@everyone\n";

                let text_1 = [
                  "日々のプロデュース業お疲れ様です！！！　" + month + "月に誕生日を迎える方々をご紹介します！！！\n" + month + "月に誕生日を迎えるのは～......\n\n",
                  "日々のプロデュース業お疲れ様です！" + month + "月にお誕生日を迎える方々のご案内です！\n" + month + "月に誕生日を迎えるのは～…\n\n",
                  "日々のプロデュース業お疲れ様です！" + month + "月にお誕生日を迎えるメンバーさんの…ご案内です！！\n" + month + "月に誕生日を迎えるのは～…\n\n",
                  "日々のプロデュース業お疲れ様です！\n" + month + "月期ラウンジオンライン飲み会のご！案！内！です！\n" + month + "月の誕生日は～～～～…\n\n"
                ];

                let text_2 = [
                  "\nです！！！はっぴばーす！と、いうわけで" + month + "月期ラウンジオンライン飲み会のご案内でぇす！！！",
                  "\nです！はっぴばーす！！！いや～めでたいねぇ（ひなた）\nではでは、" + month + "月期ラウンジオンライン飲み会のご案内です！\n\nQ.ラウンジオンライン飲み会ってなんなん？\nA.ラウンジDiscordに集まってオンラインでやる飲み会だよ！まんまだね！お酒飲めない子はジュースだね！\n　その月の誕生日の人が来たらバースデーを歌ってあげる~~奇習~~お祝いがあるよ！",
                  "\nです！！！！！おめでとうございますわ～～～～～～～～！！！！！！\nというわけで！" + month + "月期ラウンジオンライン飲み会のご案内です！\n\nQ.ラウンジオンライン飲み会ってなんなん？\nA.ラウンジDiscordに集まってオンラインでやる飲み会だよ！まんまだね！\n　あと、その月の誕生日の人が来たらバースデーを歌ってあげる~~奇習~~お祝いがあるよ！",
                  "\nです！！！！！！です！おめでとうございます～～～～～～！！！！！！！"
                ];

                let text_3 = [
                  "遅刻OK早上がりOK、お酒やジュースを飲みながらおしゃべりを楽しむ月一の定例飲み会です！\n皆さんお気軽にご参加お待ちしてま～～～～す(o・∇・o)",
                  "遅れて参加してもOK、眠くなったら先に眠ってもOKの飲み会です！周年イベントが明けても次のイベントはすぐに始まるから（遠い目） お疲れ様会も兼ねて盛り上がってまいりましょう～！多くの皆様方のご参加をお待ちしております！！！！！！！！！お酒お酒お酒お酒！！！！！！！！！",
                  "遅れて参加してもOK!!眠くなったら先に眠ってもOK!!の飲み会です！気持ちアゲていきましょう！！！！ぶいぶい！！！！！！お酒お酒お酒お酒!!!!!!",
                  "遅れて参加してもOK,眠くなったら先に上がってもOKの飲み会です、気ままに楽しみましょう！！！どしどしご参加くださいーーーー！！！！！お酒お酒お酒!!!"
                ];
        
                text += text_1[Math.floor(Math.random() * text_1.length)];
        
                for(let member of birthday_for_235_member.data){
                  if(member.month === month){
                    text += "**" + member.date + "日..." + member.name + "さん**\n";
                  }
                }

                text += text_2[Math.floor(Math.random() * text_2.length)];
        
                text += "\n\n**開催日：" + month + "月" + data[1] + "日 （" + dayArray[dayIndex] + "）**\n**時間：" + data[2] + "時ごろ～眠くなるまで**\n**場所：ラウンジDiscord雑談通話**\n**持参品：**:shaved_ice::icecream::ice_cream::cup_with_straw::champagne_glass::pizza::cookie:\n\n";

                text += text_3[Math.floor(Math.random() * text_3.length)];
        
                message.channel.send(text);
                setTimeout(() => message.reply("うたたねさん、今回もお疲れ様です！\nいつもありがとうございます♪"), 6_000);
                setTimeout(() => {
                  message.delete()
                  .then((data) => data)
                  .catch((err) => err);
                }, information.message_delete_time);
  
  
              }else{
                message.reply("時間は0～23の間で入力してください！");
                setTimeout(() => {
                  message.delete()
                  .then((data) => data)
                  .catch((err) => err);
                }, information.message_delete_time);
              }
            }else{
              message.reply("日は1～" + last_date + "の間で入力してください！");
              setTimeout(() => {
                message.delete()
                .then((data) => data)
                .catch((err) => err);
              }, information.message_delete_time);
            }
          }else{
            message.reply("月は1～12の間で入力してください！");
            setTimeout(() => {
              message.delete()
              .then((data) => data)
              .catch((err) => err);
            }, information.message_delete_time);
          }
        }
  
  
      }

    }

  }else if(command === "men"){           // mendateコマンド 男子会の日程を決めるためのコマンド

    // うたたねさん以外は使えないように
    if(message.author.username !== "うたたねさん"){

      message.reply("235men コマンドは、ラウンジマスターである**うたたねさん**だけが使用出来るコマンドです。");
      setTimeout(() => {
        message.delete()
        .then((data) => data)
        .catch((err) => err);
      }, information.message_delete_time);

    }else{

      if(data.length === 0){
        
        message.reply("235menコマンドは、235士官学校の日程を決めるために使用するコマンドです。\n開校したい日程を**半角スペースで区切って**入力してください。（半角数字のみ、月、曜日などは不要）\n入力できる日程の数は**2～10個まで**です！\n\n235men 8 12 15 21");
        setTimeout(() => {
          message.delete()
          .then((data) => data)
          .catch((err) => err);
        }, information.message_delete_time);
  
      }else if((data.length > 10) || (data.length === 1)){
        
        message.reply("235menコマンドで入力することができる日程の数は**2～10個まで**です！");
        setTimeout(() => {
          message.delete()
          .then((data) => data)
          .catch((err) => err);
        }, information.message_delete_time);
  
      }else{
        
        let int_check = true;
  
        for(let check of data){
          if(!Number.isInteger(Number(check))){
            int_check = false;
          }
        }
  
        if(!int_check){
  
          message.reply("半角数字以外が含まれています！\n日程は**半角数字のみ**で入力してください！");
          setTimeout(() => {
            message.delete()
            .then((data) => data)
            .catch((err) => err);
          }, information.message_delete_time);
  
        }else{
          
          if(def.existsSameValue(data)){
  
            message.reply("同じ日程が入力されています！\n日程を入力するときは同じ日程を入力しないように気をつけてください！");
            setTimeout(() => {
              message.delete()
              .then((data) => data)
              .catch((err) => err);
            }, information.message_delete_time);
  
          }else{
  
            let date_check      = true;
            let last_date_check = new Date();
            let last_date_month = new Date(last_date_check.getFullYear(), last_date_check.getMonth() + 1, 0);  // 今月末を取得
            let last_date       = last_date_month.getDate();                                                   // 今月末日
  
            for(let date of data){
              if((Number(date) < 1) || (Number(date) > last_date)){
                date_check = false;
              }
            }
  
            if(!date_check){
  
              message.reply("日は1～" + last_date + "の間で入力してください！");
              setTimeout(() => {
                message.delete()
                .then((data) => data)
                .catch((err) => err);
              }, information.message_delete_time);
  
            }else{
  
              const dayArray = ["日曜日", "月曜日", "火曜日", "水曜日", "木曜日", "金曜日", "土曜日"];
        
              // 指定された日の曜日を取得
              let now      = new Date();
              let year     = now.getFullYear();
              let month    = now.getMonth() + 1;
              let eventDays = [];
              let dayIndexs = [];
  
              for(let i = 0; i < data.length; i++){
                data[i] = Number(data[i]);
                eventDays.push(new Date(year, month - 1, data[i]));
                dayIndexs.push(eventDays[i].getDay());
              }
  
              // 昇順にする
              data.sort(def.compareFunc);
  
              let text = "@everyone\n";

              let text_1 = [
                "ふみこ男子の皆様方～～～～～～～～～～～！" + month + "月期の235士官学校開校日を決めたいと思いますわ～～～～～！！！日程なんですけど、\n\n",
                "ふみこ男子の皆様方～～～～～～～～～！" + month + "月期の235士官学校開校日を決めたいと思います！その日程なんですけど、\n\n"
              ];

              let text_2 = [
                "\n誠に勝手ながらこのいずれかの日程でやろうと思いますので、スタンプで反応を頂けると嬉しいです～～～～ふみこ男子の皆様方！よろしくおねがいしますわね！！！！！！！！！ﾍｹｯ!!!!!!!!",
                "\n真に勝手ながらこのいずれかにしようと思いますので、2~3日中にスタンプで反応を頂けると幸いです！よろしくお願いしま～～～～～～～す🙏"
              ];

              text += text_1[Math.floor(Math.random() * text_1.length)];
  
              // 日程一覧
              for(let i = 0; i < data.length; i++){
                text += "**" + month + "月" + data[i] + "日 （" + dayArray[dayIndexs[i]] + "）…　" + information.emojis[i] + "**\n";
              }
  
              text += text_2[Math.floor(Math.random() * text_2.length)];;
  
              message.channel.send(text);
              db.run("insert into emojis(count) values(?)", data.length);
              setTimeout(() => message.reply("うたたねさん、今回もお疲れ様です！\nいつもありがとうございます♪"), 6_000);
              setTimeout(() => {
                message.delete()
                .then((data) => data)
                .catch((err) => err);
              }, information.message_delete_time);
  
  
            }
  
          }
  
        }
  
      }

    }

  }else if(command === "roomdivision"){  // roomdivisionコマンド ボイスチャンネルに参加しているメンバーを2つに分ける

    // 雑談チャンネルに参加しているメンバー一覧をシャッフル
    let members     = client.voice.client.channels.cache.get(information.voice_channel_for_235_chat_place).members.map(member => member);
    members         = def.shuffle(members);

    let membersName = members.map(data => {
      switch(data.nickname){
        case null:

          return data.user.username;

        default:

          return data.nickname;
      }
    });

    let membersId = members.map(data => data.user.id);

    //ボイスチャンネルに参加していない人は打てないように そして参加している人が10人未満の時も打てないように
    if(membersId.includes(message.author.id)){

      if(client.voice.client.channels.cache.get(information.voice_channel_for_235_chat_place).members.size < 10){

        message.reply("雑談ボイスチャンネルに参加しているメンバーの人数が10人未満のため、分けることが出来ません！");
        setTimeout(() => {
          message.delete()
          .then((data) => data)
          .catch((err) => err);
        }, information.message_delete_time);

      }else{

        message.channel.sendTyping();

        let divisionCount    = 0;
        let duplicationCount = 100;
        let halfMembersName1 = [];
        let halfMembersName2 = [];
        let halfMembersId1   = [];
        let halfMembersId2   = [];
        let halfIndex1       = 0;
        let halfIndex2       = 0;


        db.all("select * from half_members", (err, rows) => {
          let dataIds = rows.map(data => data.id);
          while(duplicationCount >= 3){
            // 初期化
            duplicationCount = 0;

            // 配列を2個の配列に分ける
            if(membersName.length % 2 === 0){

              halfIndex1 = Math.floor(membersName.length / 2) - 1;
              halfIndex2 = membersName.length - halfIndex1 - 1;

            }else{

              halfIndex1  = Math.floor(membersName.length / 2);
              halfIndex2  = membersName.length - halfIndex1;

            }

            for(let i = 0; i <= halfIndex1; i++){

              halfMembersName1.push(membersName[i]);
              halfMembersId1.push(membersId[i]);

            }

            for(let i = halfIndex2; i < membersName.length; i++){

              halfMembersName2.push(membersName[i]);
              halfMembersId2.push(membersId[i]);

            }

            // 3人以上被ってないかチェック
            duplicationCount = halfMembersId2.filter(x => dataIds.indexOf(x) !== -1).length;

            // 2個目の配列の人達を雑談その2に移動させる
            if(duplicationCount < 3){

              db.run("delete from half_members");

              setTimeout(() => message.reply("このような結果になりました！\n\n**雑談**\n------------------------------------------------------------\n" + halfMembersName1.join("\n") + "\n------------------------------------------------------------\n\n**雑談その2**\n------------------------------------------------------------\n" + halfMembersName2.join("\n") + "\n------------------------------------------------------------\n\n自動で分けられますのでしばらくお待ちください。"), 2_000);

              setTimeout(() => {

                let roomDivisionTimer = setInterval(() => {
                  if(divisionCount === halfMembersName2.length){

                    message.delete()
                    .then((data) => data)
                    .catch((err) => err);
                    clearInterval(roomDivisionTimer);

                  }else{

                    db.run("insert into half_members(id) values(?)", halfMembersId2[divisionCount]);
                    client.guilds.cache.get(information.server_for_235).members.fetch(halfMembersId2[divisionCount]).then((user) => user.voice.setChannel(information.voice_channel_for_235_chat_place_2));
                    divisionCount++;

                  }
                }, 1_000);

              }, 9_000);

              break;

            }

            // 初期化
            members          = def.shuffle(members);

            membersName      = members.map(data => {
              switch(data.nickname){
                case null:

                  return data.user.username;

                default:

                  return data.nickname;
              }
            });

            membersId        = members.map(data => data.user.id);
            halfMembersName1 = [];
            halfMembersName2 = [];
            halfMembersId1   = [];
            halfMembersId2   = [];

          }
        });

      }

    }else{

      message.reply("235roomdivision コマンドは、雑談ボイスチャンネルに参加しているメンバーが使用できるコマンドです。");
      setTimeout(() => {
        message.delete()
        .then((data) => data)
        .catch((err) => err);
      }, information.message_delete_time);

    }

  }else if(command === "test"){      // testコマンド テスト用 俺以外は打てないようにする。

    if(message.author.username === "まき"){

      message.reply("テスト用コマンド");
      setTimeout(() => {
        message.delete()
        .then((data) => data)
        .catch((err) => err);
      }, information.message_delete_time);

    }else{

      message.reply("このコマンドは開発者だけが使えるコマンドです。");
      setTimeout(() => {
        message.delete()
        .then((data) => data)
        .catch((err) => err);
      }, information.message_delete_time);

    }

  }else{                             // コマンドを間違って打っちゃってた時の処理

    const commands     = ["ap", "apall", "notap", "apsearch", "help", "birthday", "men", "roomdivision"];
    let command_min    = 0xFFFF;
    let result_command = "";

    for(let result of commands){
        if(command_min > def.levenshteinDistance(command, result)){
            command_min    = def.levenshteinDistance(command.toUpperCase(), result.toUpperCase());
            result_command = result;
        }
    }

    if(command_min <= 3){

      message.reply("コマンド名が間違っているようです。\n\nもしかして　235" + result_command + "？");
      setTimeout(() => {
        message.delete()
        .then((data) => data)
        .catch((err) => err);
      }, information.message_delete_time);

    }

  }

});

client.login(token.BOT_TOKEN);
