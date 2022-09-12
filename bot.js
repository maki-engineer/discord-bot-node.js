"use strict";

// SQLite3導入
const sqlite3 = require("sqlite3");
const db      = new sqlite3.Database("235data.db");

// 別ファイル導入
const birthday = require("./birthdays");
const def      = require("./function");

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

const channel_for_235_chat_place  = "791397952090275900";
const channel_for_test_chat_place = "1017805557354205194";
const prefix                      = "235";
const emojis                      = ["1️⃣", "2️⃣", "3️⃣", "4️⃣", "5️⃣", "6️⃣", "7️⃣", "8️⃣", "9️⃣", "🔟"];
const types                       = ["All", "Princess", "Angel", "Fairy"];
const check_types                 = ["AL", "PR", "AN", "FA"];
const escapes                     = ["!", "∨", "@", "/", "#", "$", "%", "&", "(", ")", "=", "-", "_", "~", "^", "|", "[", "]", "{", "}", "*", "+", "д", "?", "<", ">", ".", ",", ":", ";"];

// 常時行う処理
client.on("ready", function() {
  // それ以外の処理機能
  const server_for_235            = {year: 2020, month: 12, date: 26};
  const cinderella_girls          = {year: 2015, month: 9, date: 3};
  const shiny_colors              = {year: 2018, month: 4, date: 24};
  const side_m                    = {year: 2014, month: 2, date: 28};
  const million_live_theater_days = {year: 2017, month: 6, date: 29};
  const idol_master               = {year: 2005, month: 7, date: 26};
  let today_birthday              = [];
  let today_birthday_people       = 0;

  const commands = [
    {name: "235ap", description: "AP曲データを登録するときや、APすることが出来た曲を登録するときに使用するコマンドです。"},
    {name: "235apall", description: "これまでAPしてきた曲数が知りたいときに使用するコマンドです。"},
    {name: "235notap", description: "まだAPすることが出来ていない曲数が知りたいときに使用するコマンドです。"},
    {name: "235apsearch", description: "入力した曲がAP出来ているか知りたいときに使用するコマンドです。"},
    {name: "235birthday", description: "毎月開催されるオンライン飲み会の企画文章を作成したいときに使用するコマンドです。"},
    {name: "235mendate", description: "毎月開催される235士官学校🌹の日程を決めるときに使用するコマンドです。"},
    {name: "235men", description: "毎月開催される235士官学校🌹の企画文章を作成したいときに使用するコマンドです。"},
    {name: "235women", description: "毎月開催される聖235女学園🌸の企画文章を作成したいときに使用するコマンドです。"}
  ];

  if(client.guilds.cache.get("783686370925084672") !== undefined){
    client.application.commands.set(commands, "783686370925084672");
  }

  if(client.guilds.cache.get("1017347780647325696") !== undefined){
    client.application.commands.set(commands, "1017347780647325696");
  }

  if(client.guilds.cache.get("1016543616090517515") !== undefined){
    client.application.commands.set(commands, "1016543616090517515");
  }

  client.user.setPresence({
    activities: [{name: "アイドルマスター ミリオンライブ! シアターデイズ "}],
    status: "online"
  });

  setInterval(function(){
    // 日付設定
    let today       = new Date();
    let today_year  = today.getFullYear();
    let today_month = today.getMonth() + 1;
    let today_date  = today.getDate();
    let today_day   = today.getDay();
    let today_hour  = today.getHours();
    let today_min   = today.getMinutes();

    // 9時にメンバーの誕生日を祝い、12時にミリシタ、235プロラウンジの周年祝い
    if((today_hour === 9) && (today_min === 0)){

      for(let member of birthday.data){
        if((today_month === member.month) && (today_date === member.date)){
          today_birthday.push(member.name);
        }
      }

      // 誕生日が1人いた時と複数人いた時
      if(today_birthday.length === 1){

        client.channels.cache.get(channel_for_235_chat_place).send("本日" + today_month + "月" + today_date + "日は**" + today_birthday[0] + "さん**のお誕生日です！！\n" + today_birthday[0] + "さん、お誕生日おめでとうございます♪");

      }else if(today_birthday.length > 1){

        let birthday_timer = setInterval(function(){
          if(today_birthday_people === today_birthday.length){
            clearInterval(birthday_timer);
          }else if(today_birthday_people === 0){

            client.channels.cache.get(channel_for_235_chat_place).send("本日" + today_month + "月" + today_date + "日は**" + today_birthday[today_birthday_people] + "さん**のお誕生日です！！\n" + today_birthday[today_birthday_people] + "さん、お誕生日おめでとうございます♪");

            today_birthday_people++;

          }else{

            client.channels.cache.get(channel_for_235_chat_place).send("さらに！！　本日は**" + today_birthday[today_birthday_people] + "さん**のお誕生日でもあります！！\n" + today_birthday[today_birthday_people] + "さん、お誕生日おめでとうございます♪");

            today_birthday_people++;

          }
        }, 4_000)  // 4秒ごと
      }

    }else if((today_hour === 12) && (today_min === 0)){
      if((today_month === side_m.month) && (today_date === side_m.date)){

        client.channels.cache.get(channel_for_235_chat_place).send("本日" + today_month + "月" + today_date + "日で**『アイドルマスター SideM』**は**" + Number(today_year - side_m.year) + "周年**を迎えます！！\nHappy Birthday♪　アイマス最高！！！");

      }else if((today_month === shiny_colors.month) && (today_date === shiny_colors.date)){

        client.channels.cache.get(channel_for_235_chat_place).send("本日" + today_month + "月" + today_date + "日で**『アイドルマスター シャイニーカラーズ』**は**" + Number(today_year - shiny_colors.year) + "周年**を迎えます！！\nHappy Birthday♪　アイマス最高！！！");

      }else if((today_month === million_live_theater_days.month) && (today_date === million_live_theater_days.date)){

        client.channels.cache.get(channel_for_235_chat_place).send("本日" + today_month + "月" + today_date + "日で**『アイドルマスター ミリオンライブ！ シアターデイズ』**は**" + Number(today_year - million_live_theater_days.year) + "周年**を迎えます！！\nHappy Birthday♪　アイマス最高！！！");

      }else if((today_month === idol_master.month) && (today_date === idol_master.date)){

        client.channels.cache.get(channel_for_235_chat_place).send("本日" + today_month + "月" + today_date + "日で**『アイドルマスター』**は**" + Number(today_year - idol_master.year) + "周年**を迎えます！！\nHappy Birthday♪　アイマス最高！！！");

      }else if((today_month === cinderella_girls.month) && (today_date === cinderella_girls.date)){

        client.channels.cache.get(channel_for_235_chat_place).send("本日" + today_month + "月" + today_date + "日で**『アイドルマスター シンデレラガールズ スターライトステージ』**は**" + Number(today_year - cinderella_girls.year) + "周年**を迎えます！！\nHappy Birthday♪　アイマス最高！！！");

      }else if((today_month === server_for_235.month) && (today_date === server_for_235.date)){

        client.channels.cache.get(channel_for_235_chat_place).send("本日" + today_month + "月" + today_date + "日で**235プロダクション**が設立されて**" + Number(today_year - server_for_235.year) + "年**が経ちました！！\nHappy Birthday♪　これからも235プロがずっと続きますように♪");

      }
    }
  }, 60_000);  // 1分ごと
});

// スラッシュコマンドが使われた時に行う処理
client.on("interactionCreate", function(interaction) {
  if(!interaction.isCommand()) return;

  if(interaction.commandName === "235ap"){

    interaction.reply("235apコマンドを使用することで、" + interaction.user.username + "さんがAPすることが出来た曲を登録することが出来ます。\nなお、もしまだ" + interaction.user.username + "さんが235apコマンドを使用したことがない場合、まずはAP曲データを登録する必要があるので、235ap と入力をして、AP曲データを登録してください。\n登録してからは、235ap 真夏のダイヤ☆ など、APすることが出来た曲名を入力することによって、入力された曲を登録することが出来ます！\n※入力することが出来る曲は1曲だけです。また、曲名はフルで入力する必要があります。2曲以上入力しているか、もしくはフルで入力することが出来ていない場合、登録することが出来ないので注意してください！");
    setTimeout(function(){ interaction.deleteReply() }, 180_000);

  }else if(interaction.commandName === "235apall"){

    interaction.reply("235apallコマンドを使用することで、" + interaction.user.username + "さんが今までAPしてきた曲と曲数を知ることが出来ます。\nなお、もしまだ" + interaction.user.username + "さんが235apコマンドを使用したことがない場合、まずはAP曲データを登録する必要があるので、235ap と入力をして、AP曲データを登録してください。\n登録してからは、235ap 真夏のダイヤ☆ など、APすることが出来た曲名を入力することによって、入力された曲を登録することが出来ます！\n曲数をタイプで絞りたい場合、235apall Fairy のように入力することで、入力されたタイプでAPしてきた曲と曲数を知ることが出来ます。\n（絞ることが出来るタイプの数は**1つ**だけです！）");
    setTimeout(function(){ interaction.deleteReply() }, 180_000);

  }else if(interaction.commandName === "235notap"){

    interaction.reply("235notapコマンドを使用することで、" + interaction.user.username + "さんがまだAP出来ていない曲と曲数を知ることが出来ます。\nなお、もしまだ" + interaction.user.username + "さんが235apコマンドを使用したことがない場合、まずはAP曲データを登録する必要があるので、235ap と入力をして、AP曲データを登録してください。\n登録してからは、235ap 真夏のダイヤ☆ など、APすることが出来た曲名を入力することによって、入力された曲を登録することが出来ます！\n曲数をタイプで絞りたい場合、235apall Fairy のように入力することで、入力されたタイプでAP出来ていない曲と曲数を知ることが出来ます。\n（絞ることが出来るタイプの数は**1つ**だけです！）");
    setTimeout(function(){ interaction.deleteReply() }, 180_000);

  }else if(interaction.commandName === "235apsearch"){

    interaction.reply("235apsearchコマンドを使用することで、" + interaction.user.username + "さんが入力した曲が既にAP出来ているか知ることが出来ます。\nなお、もしまだ" + interaction.user.username + "さんが235apコマンドを使用したことがない場合、まずはAP曲データを登録する必要があるので、235ap と入力をして、AP曲データを登録してください。\n登録してからは、235ap 真夏のダイヤ☆ など、APすることが出来た曲名を入力することによって、入力された曲を登録することが出来ます！\n※入力することが出来る曲は1曲だけです。また、曲名はフルで入力する必要があります。2曲以上入力しているか、もしくはフルで入力することが出来ていない場合、登録することが出来ないので注意してください！");
    setTimeout(function(){ interaction.deleteReply() }, 180_000);

  }else if(interaction.commandName === "235birthday"){

    interaction.reply("235birthdayコマンドを使用することで、毎月開催されるオンライン飲み会の企画文章を作成することが出来ます。コマンドを使用するときは、開催したい月、日程、時間の**3つ**を**半角数字のみ**、**半角スペースで区切って**入力してください。\n※235birthday コマンドは、ラウンジマスターである**うたたねさん**だけが使用出来るコマンドです。\n\n235birthday 12 14 21");
    setTimeout(function(){ interaction.deleteReply() }, 180_000);

  }else if(interaction.commandName === "235mendate"){

    interaction.reply("235mendateコマンドを使用することで、毎月開催される235士官学校🌹の日程を決める文章を作成することが出来ます。コマンドを使用するときは、開催したい日程を**2～10個**、**半角数字のみ**で入力してください。\n※235mendate コマンドは、ラウンジマスターである**うたたねさん**だけが使用出来るコマンドです。\n\n235mendate 12 14 16 17");
    setTimeout(function(){ interaction.deleteReply() }, 180_000);

  }else if(interaction.commandName === "235men"){

    interaction.reply("235menコマンドを使用することで、毎月開催される235士官学校🌹の企画文章を作成することが出来ます。コマンドを使用するときは、開催したい日程を**1つ半角数字のみ**で入力してください。なお、日程を入力しなかった場合は、当日の文章が作成されます。\n※235men コマンドは、ラウンジマスターである**うたたねさん**だけが使用出来るコマンドです。\n\n235men 23");
    setTimeout(function(){ interaction.deleteReply() }, 180_000);

  }else if(interaction.commandName === "235women"){

    interaction.reply("235womenコマンドを使用することで、毎月開催される聖235女学園🌸の企画文章を作成することが出来ます。コマンドを使用するときは、開催したい日程を**1つ半角数字のみ**で入力してください。なお、日程を入力しなかった場合は、当日の文章が作成されます。\n※235women コマンドは、聖235女学園🌸の担当者である**きなくるさん**だけが使用出来るコマンドです。\n\n235women 12");
    setTimeout(function(){ interaction.deleteReply() }, 180_000);

  }

});

// メッセージが送信された時に行う処理
client.on("messageCreate", function(message) {
  // イベント企画の文章作成機能でアクションを付ける必要がある235botのメッセージだけは反応する
  db.all("select * from emojis", (err, rows) => {
    if(err){
      console.log(err);
    }else{
      if(rows.length === 1){
        for(let i = 0; i < rows[0].count; i++){
          message.react(emojis[i]);
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

  // botからのメッセージは無視
  if(message.author.bot) return;

  // コマンドメッセージ以外は無視
  if(!message.content.startsWith(prefix)) return;

  const msg     = message.content.slice(prefix.length);  // 235の文字だけ削除
  const data    = msg.split(" ");                        // コマンド以外の文字があったらそれを配列で取得
  const command = data.shift().toLowerCase();            // コマンド内容を小文字で取得


  if(command === "ap"){              // apコマンド このコマンドを初めて使った人のAP曲データ登録、APした曲をデータに登録する。
    // apコマンドのみの場合 初めて使った人ならAP曲データ登録、2度目以降なら曲名入れてね警告する。
    if(data.length === 0){

      let names = message.author.username.split("");
      
      for(let i = 0; i < names.length; i++){
        if(escapes.includes(names[i])) names[i] = "";
      }

      names = names.join("");

      db.all("select " + names + "_flg" + " from APmusics where " + names + "_flg = 1", (err, rows) => {
        // コマンドを打ってきた人がまだカラムを登録してなかったらカラムを登録してから処理を開始
        if(err){

          db.run("alter table APmusics add column " + names + "_flg default 0");

          message.reply("今回" + message.author.username + "さんは初めて235apコマンドを使ったので、新しく" + message.author.username + "さんのAP曲データを登録しました！\nAPすることが出来たら、235ap DIAMOND のようにコマンドを使って、どんどんAPすることが出来た曲を登録していきましょう！\n※曲名はフルで入力してください！（フルで入力することが出来ていなかったり、2曲以上入力している場合、登録することが出来ません。）");
          setTimeout(function(){message.delete();}, 1_000);

        }else{

          message.reply(message.author.username + "さんは既にAP曲データが登録されています！ APすることが出来た曲を登録したい場合、235ap DIAMOND のようにコマンドを使って登録してください！\n※曲名はフルで入力してください！（フルで入力することが出来ていなかったり、2曲以上入力している場合、登録することが出来ません。）");
          setTimeout(function(){message.delete();}, 1_000);

        }
      });

    }else{

      let names = message.author.username.split("");
      
      for(let i = 0; i < names.length; i++){
        if(escapes.includes(names[i])) names[i] = "";
      }

      names = names.join("");

      const musics    = msg.slice(3).split("^");

      db.all("select name, " + names + "_flg" + " from APmusics", (err, rows) => {
        // コマンドを打ってきた人がまだカラムを登録してなかったらapコマンド使うように警告
        if(err){

          message.reply("まだ" + message.author.username + "さんのAP曲データが登録されていないようです......\nまずは 235ap コマンドを使って" + message.author.username + "さんのAP曲データを登録してからAPすることが出来た曲を登録してください！");
          setTimeout(function(){message.delete();}, 1_000);

        }else{

          let min   = 0xFFFF;
          let suggest_music = "";

          for(let row of rows){
              if(min > def.levenshteinDistance(musics[0].toUpperCase(), row.name.toUpperCase())){
                  min   = def.levenshteinDistance(musics[0].toUpperCase(), row.name.toUpperCase());
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
                        setTimeout(function(){message.delete();}, 1_000);

                      }else{

                        db.run("update APmusics set " + names + "_flg = 1 where name = ?", suggest_music);
                        message.reply("登録成功：" + suggest_music + "\nAPおめでとうございます♪");
                        setTimeout(function(){message.delete();}, 1_000);

                      }
                    });

                  }else if((min > 1) && (min < 6)){

                    message.reply("登録に失敗しました......\n\nこちらのコマンドを試してみてはいかがでしょうか？　235ap " + suggest_music);
                    setTimeout(function(){message.delete();}, 1_000);

                  }else{

                    message.reply("登録に失敗しました......\n正しく曲名を**フル**で入力できているか、もしくは**2曲以上入力していないか**どうか確認してみてください！");
                    setTimeout(function(){message.delete();}, 1_000);

                  }
                }else{

                  if(rows[0][names + "_flg"] === 1){

                    message.reply(rows[0].name + " は既に登録されています！");
                    setTimeout(function(){message.delete();}, 1_000);

                  }else{

                    db.run("update APmusics set " + names + "_flg = 1 where name = ?", music);
                    message.reply("登録成功：" + music + "\nAPおめでとうございます♪");
                    setTimeout(function(){message.delete();}, 1_000);

                  }

                }
              }
            });
          }

        }

      });

    }

  }else if(command === "apall"){     // apallコマンド 今までAPしてきた曲一覧を教える。

    if(data.length === 0){

      let names = message.author.username.split("");
      
      for(let i = 0; i < names.length; i++){
        if(escapes.includes(names[i])) names[i] = "";
      }

      names = names.join("");

      db.all("select name, " + names + "_flg" + " from APmusics where " + names + "_flg = 1", (err, rows) => {
        // コマンドを打ってきた人がまだカラムを登録してなかったらapコマンド使うように警告
        if(err){

          message.reply("まだ" + message.author.username + "さんのAP曲データが登録されていないようです......\nまずは 235ap コマンドを使って" + message.author.username + "さんのAP曲データを登録してからAPすることが出来た曲を登録してください！");
          setTimeout(function(){message.delete();}, 1_000);

        }else{

          // まだ1曲もAPしてないかどうか
          if(rows.length === 0){

            message.reply(message.author.username + "さんはまだ今までAPしてきた曲はないようです。\nもしまだAPした曲を登録していない場合、235ap DIAMOND のようにコマンドを使って登録してください！\n※曲名はフルで入力してください！（フルで入力することが出来ていなかったり、2曲以上入力している場合、登録することが出来ません。）");
            setTimeout(function(){message.delete();}, 1_000);

          }else{

            let musicNames  = rows.map((item) => {return item.name});
            let sliceMusics = def.sliceByNumber(musicNames, 100);
            let count       = 0;
            let text        = "";

            if(sliceMusics.length === 1){

              text = sliceMusics[count].join("\n");
              message.reply("AP曲\n\n" + text + "\n\n合計" + rows.length + "曲");
              setTimeout(() => message.delete(), 1_000);

            }else{
              
              let text_timer = setInterval(() => {
                if(count === sliceMusics.length){

                  message.delete();
                  clearInterval(text_timer);

                }else{

                  text = sliceMusics[count].join("\n");

                  if(count === 0){

                    message.reply("AP曲数\n\n" + text);

                  }else if(count === sliceMusics.length - 1){

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
        if(escapes.includes(names[i])) names[i] = "";
      }

      names = names.join("");

      // タイプ以外の文字が入力されてたら警告
      let check             = false;

      for(let i = 0; i < types.length; i++){
        if(data[0].toUpperCase().startsWith(check_types[i])){
          data[0] = types[i];
        }
      }

      if(!def.isIncludes(["All", "Princess", "Angel", "Fairy"], data[0])){
        check = true;
      }

      if(check){

        message.reply("入力された文字の中にタイプ名じゃない文字が入っています！\n正しいタイプ名(All, Princess, Fairy, Angel)を入力してください！\n\n235apall All");
        setTimeout(function(){message.delete();}, 1_000);

      }else{

        db.all("select name, " + names + "_flg" + " from APmusics where " + names + "_flg = 1 and type = ?", data[0], (err, rows) => {
          // コマンドを打ってきた人がまだカラムを登録してなかったらapコマンド使うように警告
          if(err){
  
            message.reply("まだ" + message.author.username + "さんのAP曲データが登録されていないようです......\nまずは 235ap コマンドを使って" + message.author.username + "さんのAP曲データを登録してからAPすることが出来た曲を登録してください！");
            setTimeout(function(){message.delete();}, 1_000);
  
          }else{
  
            // まだ1曲もAPしてないかどうか
            if(rows.length === 0){
  
              message.reply(message.author.username + "さんはまだ" + data[0] + "曲で今までAPしてきた曲はないようです。\nもしまだAPした曲を登録していない場合、235ap DIAMOND のようにコマンドを使って登録してください！\n※曲名はフルで入力してください！（フルで入力することが出来ていなかったり、2曲以上入力している場合、登録することが出来ません。）");
              setTimeout(function(){message.delete();}, 1_000);
  
            }else{

              let musicNames  = rows.map((item) => {return item.name});
              let sliceMusics = def.sliceByNumber(musicNames, 100);
              let count       = 0;
              let text        = "";

              if(sliceMusics.length === 1){

                text = sliceMusics[count].join("\n");
                message.reply(data[0] + " AP曲\n\n" + text + "\n\n合計" + rows.length + "曲");
                setTimeout(() => message.delete(), 1_000);

              }else{

                let text_timer = setInterval(() => {
                  if(count === sliceMusics.length){

                    message.delete();
                    clearInterval(text_timer);

                  }else{

                    text = sliceMusics[count].join("\n");

                    if(count === 0){

                      message.reply(data[0] + " AP曲\n\n" + text);

                    }else if(count === sliceMusics.length - 1){

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
      setTimeout(function(){message.delete();}, 1_000);
    }

  }else if(command === "notap"){     // notapコマンド まだAPしてない曲一覧を教える。

    if(data.length === 0){

      let names = message.author.username.split("");
      
      for(let i = 0; i < names.length; i++){
        if(escapes.includes(names[i])) names[i] = "";
      }

      names = names.join("");

      db.all("select name, " + names + "_flg" + " from APmusics where " + names + "_flg = 0", (err, rows) => {
        // コマンドを打ってきた人がまだカラムを登録してなかったらapコマンド使うように警告
        if(err){

          message.reply("まだ" + message.author.username + "さんのAP曲データが登録されていないようです......\nまずは 235ap コマンドを使って" + message.author.username + "さんのAP曲データを登録してからAPすることが出来た曲を登録してください！");
          setTimeout(function(){message.delete();}, 1_000);

        }else{

          // まだ1曲もAPしてないかどうか
          if(rows.length === 0){

            message.reply(message.author.username + "さんはもう既に全ての曲をAPすることが出来ています！\nおめでとうございます♪");
            setTimeout(function(){message.delete();}, 1_000);

          }else{

            let musicNames  = rows.map((item) => {return item.name});
            let sliceMusics = def.sliceByNumber(musicNames, 100);
            let count       = 0;
            let text        = "";

            if(sliceMusics.length === 1){

              text = sliceMusics[count].join("\n");
              message.reply("AP未達成曲\n\n" + text + "\n\n合計" + rows.length + "曲");
              setTimeout(() => message.delete(), 1_000);

            }else{

              let text_timer = setInterval(() => {
                if(count === sliceMusics.length){

                  message.delete();
                  clearInterval(text_timer);

                }else{

                  text = sliceMusics[count].join("\n");

                  if(count === 0){

                    message.reply("AP未達成曲\n\n" + text);

                  }else if(count === sliceMusics.length - 1){

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
        if(escapes.includes(names[i])) names[i] = "";
      }

      names = names.join("");

      // タイプ以外の文字が入力されてたら警告
      let check             = false;

      for(let i = 0; i < types.length; i++){
        if(data[0].toUpperCase().startsWith(check_types[i])){
          data[0] = types[i];
        }
      }

      if(!def.isIncludes(["All", "Princess", "Angel", "Fairy"], data[0])){
        check = true;
      }

      if(check){

        message.reply("入力された文字の中にタイプ名じゃない文字が入っています！\n正しいタイプ名(All, Princess, Fairy, Angel)を入力してください！\n\n235apall All");
        setTimeout(function(){message.delete();}, 1_000);

      }else{

        db.all("select name, " + names + "_flg" + " from APmusics where " + names + "_flg = 0 and type = ?", data[0], (err, rows) => {
          // コマンドを打ってきた人がまだカラムを登録してなかったらapコマンド使うように警告
          if(err){
  
            message.reply("まだ" + message.author.username + "さんのAP曲データが登録されていないようです......\nまずは 235ap コマンドを使って" + message.author.username + "さんのAP曲データを登録してからAPすることが出来た曲を登録してください！");
            setTimeout(function(){message.delete();}, 1_000);
  
          }else{
  
            // まだ1曲もAPしてないかどうか
            if(rows.length === 0){
  
              message.reply(message.author.username + "さんはもう既に全ての曲をAPすることが出来ています！\nおめでとうございます♪");
              setTimeout(function(){message.delete();}, 1_000);
  
            }else{

              let musicNames  = rows.map((item) => {return item.name});
              let sliceMusics = def.sliceByNumber(musicNames, 100);
              let count       = 0;
              let text        = "";

              if(sliceMusics.length === 1){

                text = sliceMusics[count].join("\n");
                message.reply(data[0] + " AP未達成曲\n\n" + text + "\n\n合計" + rows.length + "曲");
                setTimeout(() => message.delete(), 1_000);

              }else{

                let text_timer = setInterval(() => {
                  if(count === sliceMusics.length){

                    message.delete();
                    clearInterval(text_timer);

                  }else{

                    text = sliceMusics[count].join("\n");

                    if(count === 0){

                      message.reply(data[0] + " AP未達成曲\n\n" + text);

                    }else if(count === sliceMusics.length - 1){

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
      setTimeout(function(){message.delete();}, 1_000);
    }

  }else if(command === "apsearch"){  // apsearchコマンド 指定された曲がAPしてあるかどうか教える。

    if(data.length === 0){

      message.reply("曲名が入力されていません！ 235apsearch DIAMOND のように曲名を入力してください！\n※曲名はフルで入力してください！（フルで入力することが出来ていなかったり、2曲以上入力している場合、見つけることが出来ません。）");
      setTimeout(function(){message.delete();}, 1_000);

    }else{

      const musics    = msg.slice(9).split("^");

      let names = message.author.username.split("");
      
      for(let i = 0; i < names.length; i++){
        if(escapes.includes(names[i])) names[i] = "";
      }

      names = names.join("");

      let text = "";

      db.all("select name, " + names + "_flg from APmusics", (err, rows) => {
        if(err){

          text += "まだ" + message.author.username + "さんのAP曲データが登録されていないようです......\nまずは 235ap コマンドを使って" + message.author.username + "さんのAP曲データを登録してからAPすることが出来た曲を登録してください！";

          message.reply(text);
          setTimeout(function(){message.delete();}, 1_000);

        }else{

          let min   = 0xFFFF;
          let suggest_music = "";

          for(let row of rows){
              if(min > def.levenshteinDistance(musics[0].toUpperCase(), row.name.toUpperCase())){
                  min   = def.levenshteinDistance(musics[0].toUpperCase(), row.name.toUpperCase());
                  suggest_music = row.name;
              }
          }

          for(let music of musics){
            db.all("select * from APmusics where name = ?", music, (err, rows) => {
              if(rows.length === 0){

                if(min <= 1){

                  message.reply(suggest_music + " は既にAPすることが出来ています！");
                  setTimeout(function(){message.delete();}, 1_000);

                }else if((min > 1) && (min < 6)){

                  message.reply("曲名を見つけることが出来ませんでした......\n\nこちらのコマンドを試してみてはいかがでしょうか？　235apsearch " + suggest_music);
                  setTimeout(function(){message.delete();}, 1_000);

                }else{

                  message.reply("曲名を見つけることが出来ませんでした......\n正しく曲名を**フル**で入力できているか、もしくは**2曲以上入力していないか**どうか確認してみてください！");
                  setTimeout(function(){message.delete();}, 1_000);

                }

              }else{
                if(rows[0][names + "_flg"] === 1){

                  message.reply(rows[0].name + " は既にAPすることが出来ています！");
                  setTimeout(function(){message.delete();}, 1_000);

                }else{

                  message.reply(rows[0].name + " はまだAP出来ていません！");
                  setTimeout(function(){message.delete();}, 1_000);

                }
              }
            });
          }

        }
      });

    }

  }else if(command === "help"){      // helpコマンド 235botの機能一覧を教える。

    message.reply("235botは以下のようなコマンドを使用することが出来ます。\n\n・235ap\n\n・235apall\n\n・235notap\n\n・235apsearch\n\n・235birthday　　このコマンドはラウンジマスターである**うたたねさん**だけが使用出来ます。\n\n・235mendate　　このコマンドはラウンジマスターである**うたたねさん**だけが使用出来ます。\n\n・235men　　　　このコマンドはラウンジマスターである**うたたねさん**だけが使用出来ます。\n\n・235women　　このコマンドは聖235女学園🌸の担当者である**きなくるさん**だけが使用出来ます。\n\n各コマンドの機能の詳細を知りたい場合は、スラッシュコマンド **/** を使って知りたい機能を選択してください。");
    setTimeout(function(){message.delete();}, 1_000);

  }else if(command === "birthday"){  // birthdayコマンド 毎月の誕生日祝い企画文章を作成

    // うたたねさん以外は使えないように
    if(message.author.username !== "うたたねさん"){

      message.reply("235birthday コマンドは、ラウンジマスターである**うたたねさん**だけが使用出来るコマンドです。");
      setTimeout(() => message.delete(), 1_000);

    }else{

      if((data.length < 3) || (data.length > 3)){
  
        message.reply("235birthdayコマンドを使う場合、birthdayの後にオンライン飲み会を開催したい月、日、時間 （半角数字のみ、曜日は不要） の3つを入力してください。\n※半角スペースで区切るのを忘れずに！！\n\n235birthday 8 15 21");
        setTimeout(function(){message.delete();}, 1_000);
  
      }else{
  
        let int_check = true;
  
        for(let check of data){
          if(!Number.isInteger(Number(check))){
            int_check = false;
          }
        }
  
        if(!int_check){
  
          message.reply("半角数字以外が含まれています！\n月、日、時間は全て**半角数字のみ**で入力してください！");
          setTimeout(function(){message.delete();}, 1_000);
  
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
        
                for(let member of birthday.data){
                  if(member.month === month){
                    text += "**" + member.date + "日..." + member.name + "さん**\n";
                  }
                }

                text += text_2[Math.floor(Math.random() * text_2.length)];
        
                text += "\n\n**開催日：" + month + "月" + data[1] + "日 （" + dayArray[dayIndex] + "）**\n**時間：" + data[2] + "時ごろ～眠くなるまで**\n**場所：ラウンジDiscord雑談通話**\n**持参品：**:shaved_ice::icecream::ice_cream::cup_with_straw::champagne_glass::pizza::cookie:\n\n";

                text += text_3[Math.floor(Math.random() * text_3.length)];
        
                message.channel.send(text);
                setTimeout(() => message.reply("うたたねさん、今回もお疲れ様です！\nいつもありがとうございます♪"), 5_000);
                setTimeout(function(){message.delete();}, 10_000);
  
  
              }else{
                message.reply("時間は0～23の間で入力してください！");
                setTimeout(function(){message.delete();}, 1_000);
              }
            }else{
              message.reply("日は1～" + last_date + "の間で入力してください！");
              setTimeout(function(){message.delete();}, 1_000);
            }
          }else{
            message.reply("月は1～12の間で入力してください！");
            setTimeout(function(){message.delete();}, 1_000);
          }
        }
  
  
      }

    }

  }else if(command === "mendate"){   // mendateコマンド 男子会の日程を決めるためのコマンド

    // うたたねさん以外は使えないように
    if(message.author.username !== "うたたねさん"){

      message.reply("235mendate コマンドは、ラウンジマスターである**うたたねさん**だけが使用出来るコマンドです。");
      setTimeout(() => message.delete(), 1_000);

    }else{

      if(data.length === 0){
        
        message.reply("235mendateコマンドは、235士官学校の日程を決めるために使用するコマンドです。\n開校したい日程を**半角スペースで区切って**入力してください。（半角数字のみ、月、曜日などは不要）\n入力できる日程の数は**2～10個まで**です！\n\n235mendate 8 12 15 21");
        setTimeout(function(){message.delete();}, 1_000);
  
      }else if((data.length > 10) || (data.length === 1)){
        
        message.reply("235mendateコマンドで入力することができる日程の数は**2～10個まで**です！");
        setTimeout(function(){message.delete();}, 1_000);
  
      }else{
        
        let int_check = true;
  
        for(let check of data){
          if(!Number.isInteger(Number(check))){
            int_check = false;
          }
        }
  
        if(!int_check){
  
          message.reply("半角数字以外が含まれています！\n日程は**半角数字のみ**で入力してください！");
          setTimeout(function(){message.delete();}, 1_000);
  
        }else{
          
          if(def.existsSameValue(data)){
  
            message.reply("同じ日程が入力されています！\n日程を入力するときは同じ日程を入力しないように気をつけてください！");
            setTimeout(function(){message.delete();}, 1_000);
  
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
              setTimeout(function(){message.delete();}, 1_000);
  
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
                text += "**" + month + "月" + data[i] + "日 （" + dayArray[dayIndexs[i]] + "）…　" + emojis[i] + "**\n";
              }
  
              text += text_2[Math.floor(Math.random() * text_2.length)];;
  
              message.channel.send(text);
              db.run("insert into emojis(count) values(?)", data.length);
              setTimeout(() => message.reply("うたたねさん、今回もお疲れ様です！\nいつもありがとうございます♪"), 5_000);
              setTimeout(function(){message.delete();}, 10_000);
  
  
            }
  
          }
  
        }
  
      }

    }

  }else if(command === "men"){       // menコマンド 男子会の企画文章を作成

    // うたたねさん以外は使えないように
    if(message.author.username !== "うたたねさん"){

      message.reply("235men コマンドは、ラウンジマスターである**うたたねさん**だけが使用出来るコマンドです。");
      setTimeout(() => message.delete(), 1_000);

    }else{

      if(data.length === 0){        // 当日の文章作成
  
        message.reply("@everyone\n235青年団の皆様方～～～～～!!!\n本日夜、235士官学校開校日…もとい男子会が開かれます！~~教練の時間だ！~~\nどしどしご参加くだーーーーい！");
        setTimeout(() => message.delete(), 1_000);
  
      }else if(data.length === 1){  // 入力された日の文章作成
  
        let int_check = true;
    
        if(!Number.isInteger(Number(data[0]))){
          int_check = false;
        }
  
        if(!int_check){
  
          message.reply("半角数字以外が含まれています！\n日程は**半角数字のみ**で入力してください！");
          setTimeout(function(){message.delete();}, 1_000);
  
        }else{
  
          let date_check      = true;
          let last_date_check = new Date();
          let last_date_month = new Date(last_date_check.getFullYear(), last_date_check.getMonth() + 1, 0);  // 今月末を取得
          let last_date       = last_date_month.getDate();                                                   // 今月末日
  
          if((Number(data[0]) < 1) || (Number(data[0]) > last_date)){
            date_check = false;
          }
  
          if(!date_check){
  
            message.reply("日は1～" + last_date + "の間で入力してください！");
            setTimeout(function(){message.delete();}, 1_000);
  
          }else{
  
            const dayArray = ["日", "月", "火", "水", "木", "金", "土"];
          
            // 指定された日の曜日を取得
            let now      = new Date();
            let year     = now.getFullYear();
            let month    = now.getMonth() + 1;
            let eventDay = new Date(year, month - 1, Number(data[0]));
            let dayIndex = eventDay.getDay();
  
            let text = "@everyone\n235青年団の皆様～！！今月の235士官学校開校日は" + month + "月" + data[0] + "日（" + dayArray[dayIndex] + "）に決まりました～！！\n235士官学校に集まってもろてやいやいやりましょう！よろしくお願いしま～～～す🌹";
  
            message.channel.send(text);
            setTimeout(() => message.reply("うたたねさん、今回もお疲れ様です！\nいつもありがとうございます♪"), 5_000);
            setTimeout(function(){message.delete();}, 10_000);
  
          }
  
        }
  
      }else{
        
        message.reply("指定出来る日程は**1つだけ**です！\n\n235men 12");
        setTimeout(() => message.delete(), 1_000);
  
      }

    }

  }else if(command === "women"){     // womenコマンド 女子会の企画文章を作成

    // きなくるさん以外は使えないように
    if(message.author.username !== "きなくる"){

      message.reply("235women コマンドは、聖235女学園🌸の担当者である**きなくるさん**だけが使用出来るコマンドです。");
      setTimeout(() => message.delete(), 1_000);

    }else{

      if(data.length === 0){        // 当日の文章作成
  
        message.reply("@everyone\n本日23女🌸です🍾\nよろしくおねがいします🌙🌙");
        setTimeout(() => message.delete(), 1_000);
  
      }else if(data.length === 1){  // 入力された日の文章作成
  
        let int_check = true;
    
        if(!Number.isInteger(Number(data[0]))){
          int_check = false;
        }
  
        if(!int_check){
  
          message.reply("半角数字以外が含まれています！\n日程は**半角数字のみ**で入力してください！");
          setTimeout(function(){message.delete();}, 1_000);
  
        }else{
  
          let date_check      = true;
          let last_date_check = new Date();
          let last_date_month = new Date(last_date_check.getFullYear(), last_date_check.getMonth() + 1, 0);  // 今月末を取得
          let last_date       = last_date_month.getDate();                                                   // 今月末日
  
          if((Number(data[0]) < 1) || (Number(data[0]) > last_date)){
            date_check = false;
          }
  
          if(!date_check){
  
            message.reply("日は1～" + last_date + "の間で入力してください！");
            setTimeout(function(){message.delete();}, 1_000);
  
          }else{
  
            const dayArray = ["日", "月", "火", "水", "木", "金", "土"];
          
            // 指定された日の曜日を取得
            let now      = new Date();
            let year     = now.getFullYear();
            let month    = now.getMonth() + 1;
            let eventDay = new Date(year, month - 1, Number(data[0]));
            let dayIndex = eventDay.getDay();
  
            let text = "@everyone\n女子の皆様！今月の23女🌸開催は" + month + "/" + data[0] + "（" + dayArray[dayIndex] + "）です。\n\nよろしくお願いします🙇‍♀️";
  
            message.channel.send(text);
            setTimeout(() => message.reply("きなくるさん、今回もお疲れ様です！\nいつもありがとうございます♪"), 5_000);
            setTimeout(function(){message.delete();}, 10_000);
  
          }
  
        }
  
      }else{
        
        message.reply("指定出来る日程は**1つだけ**です！\n\n235women 12");
        setTimeout(() => message.delete(), 1_000);
  
      }

    }


  }else if(command === "test"){      // testコマンド テスト用 メンバーのみんなにはこのコマンドは教えないようにする。

    message.reply("テスト用コマンド");
    setTimeout(function(){message.delete();}, 1_000);

  }else{                             // コマンドを間違って打っちゃってた時の処理

    const commands     = ["ap", "apall", "notap", "apsearch", "help", "birthday", "mendate", "men", "women", "lunch"];
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
      setTimeout(function(){message.delete();}, 1_000);
    }

  }
});

client.login(token.BOT_TOKEN);
