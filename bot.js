"use strict";

// SQLite3導入
const sqlite3 = require("sqlite3");
const db      = new sqlite3.Database("235data.db");

// 別ファイル導入
const birthday = require("./birthdays");
const def      = require("./function");

const { Client, GatewayIntentBits, TextChannel } = require("discord.js");
const token                         = require("./discord-token.json");
const { IncomingMessage } = require("http");
const { devNull } = require("os");
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

const prefix = "235";

client.on("messageCreate", function(message) {
  // コマンドに対する処理機能
  {
    // botからのメッセージは無視
    if(message.author.bot) return;

    // コマンドメッセージ以外は無視
    if(!message.content.startsWith(prefix)) return;

    const msg     = message.content.slice(prefix.length);  // 235の文字だけ削除
    const data    = msg.split(" ");                        // コマンド以外の文字があったらそれを配列で取得
    const command = data.shift().toLowerCase();            // コマンド内容を小文字で取得

    // apコマンド このコマンドを初めて使った人のAP曲データ登録、APした曲をデータに登録する。
    if(command === "ap"){
      // apコマンドのみの場合 初めて使った人ならAP曲データ登録、2度目以降なら曲名入れてね警告する。
      if(data.length === 0){

        db.all("select " + message.author.username + "_flg" + " from APmusics where " + message.author.username + "_flg = 1", (err, rows) => {
          // コマンドを打ってきた人がまだカラムを登録してなかったらカラムを登録してから処理を開始
          if(err){

            db.run("alter table APmusics add column " + message.author.username + "_flg default 0");

            message.reply("今回" + message.author.username + "さんは初めてapコマンドを使ったので、新しく" + message.author.username + "さんのAP曲データを登録しました！\nAPすることが出来たら、どんどんAPすることが出来た曲を登録していきましょう！\n**※曲名は （ https://imasml-theater-wiki.gamerch.com/%E6%A5%BD%E6%9B%B2%E4%B8%80%E8%A6%A7 ）にある曲名をコピーしてペーストするか、もしくは直接フルで入力してください！（フルで入力することが出来ていない場合、登録することが出来ません。）**\n**※登録したい曲はいくつも指定することが出来ます！ （半角スペースで区切るのを忘れずに！！）**\n\nAPすることが出来た曲を登録するコマンド → **235ap DIAMOND 夢にかけるRainbow**");

          }else{

            message.reply(message.author.username + "さんは既にAP曲データが登録されています！ APすることが出来た曲を登録したい場合、下記のようにコマンドを使ってください！\n**※曲名は （ https://imasml-theater-wiki.gamerch.com/%E6%A5%BD%E6%9B%B2%E4%B8%80%E8%A6%A7 ）にある曲名をコピーしてペーストするか、もしくは直接フルで入力してください！（フルで入力することが出来ていない場合、登録することが出来ません。）**\n**※登録したい曲はいくつも指定することが出来ます！ （半角スペースで区切るのを忘れずに！！）**\n\n**235ap DIAMOND 夢にかけるRainbow**");

          }
        });

      }else{

        db.all("select " + message.author.username + "_flg" + " from APmusics limit 1", (err, rows) => {
          // コマンドを打ってきた人がまだカラムを登録してなかったらapコマンド使うように警告
          if(err){

            message.reply("まだ" + message.author.username + "さんのAP曲データが登録されていないようです......\nまずは　**235ap**　コマンドを使って" + message.author.username + "さんのAP曲データを登録してからAPすることが出来た曲を登録してください！");

          }else{

            let text = "以下の曲を登録しました。\n\n";

            for(let music of data){
              db.all("select * from APmusics where name = ?", music, (err, rows) => {
                if(err){
                  console.log(err);
                }else{
                  if(rows.length === 0){
                    text += "登録失敗：" + music + "\n";
                  }else{
                    db.run("update APmusics set " + message.author.username + "_flg = 1 where name = ?", music);
                    text += "登録成功：" + music + "\n";
                  }
                }
              });
            }

            message.reply(text);

          }

        });

      }

    // apallコマンド 今までAPしてきた曲一覧を教える。
    }else if(command === "apall"){

      db.all("select name, " + message.author.username + "_flg" + " from APmusics where " + message.author.username + "_flg = 1", (err, rows) => {
        // コマンドを打ってきた人がまだカラムを登録してなかったらapコマンド使うように警告
        if(err){

          message.reply("まだ" + message.author.username + "さんのAP曲データが登録されていないようです......\nまずは　**235ap**　コマンドを使って" + message.author.username + "さんのAP曲データを登録してからAPすることが出来た曲を登録してください！");

        }else{

          // まだ1曲もAPしてないかどうか
          if(rows.length === 0){

            message.reply(message.author.username + "さんはまだ今までAPしてきた曲はないようです。\nもしまだAPした曲を登録することが出来ていない場合、下記のようにコマンドを使ってください！\n**※曲名は （ https://imasml-theater-wiki.gamerch.com/%E6%A5%BD%E6%9B%B2%E4%B8%80%E8%A6%A7 ）にある曲名をコピーしてペーストするか、もしくは直接フルで入力してください！（フルで入力することが出来ていない場合、登録することが出来ません。）**\n**※登録したい曲はいくつも指定することが出来ます！ （半角スペースで区切るのを忘れずに！！）**\n\n**235ap DIAMOND 夢にかけるRainbow**");

          }else{

            let text = "AP曲数：" + rows.length + "\n\n";

            for(let music of rows){
              text += music + "\n";
            }

            message.reply(text);

          }
        }
      });

    // apsearchコマンド 指定された曲がAPしてあるかどうか教える。
    }else if(command === "apsearch"){

      if(data.length === 0){

        message.reply("曲名が入力されていません！　曲名を入力してください！\n**※曲名は （ https://imasml-theater-wiki.gamerch.com/%E6%A5%BD%E6%9B%B2%E4%B8%80%E8%A6%A7 ）にある曲名をコピーして入力するか、もしくは直接フルで入力してください！（フルで入力することが出来ていない場合、見つけることが出来ません。）**\n**※APすることが出来ているか知りたい曲はいくつも指定することが出来ます！ （半角スペースで区切るのを忘れずに！！）**\n\n**235apsearch DIAMOND 夢にかけるRainbow**");

      }else{

        let text = "";

        db.all("select " + message.author.username + "_flg from APmusics", (err, rows) => {
          if(err){

            text += "まだ" + message.author.username + "さんのAP曲データが登録されていないようです......\nまずは　**235ap**　コマンドを使って" + message.author.username + "さんのAP曲データを登録してからAPすることが出来た曲を登録してください！";

            message.reply(text);

          }else{

            for(let music of data){
              db.all("select name " + message.author.username + "_flg from APmusics where name = ?", music, (err, rows) => {
                if(rows.length === 0){
                  text += "**" + music + "：曲名を見つけることが出来ませんでした。**\n";
                }else{
                  if(rows[0][message.author.username + "_flg"] === 1){
                    text += "**" + music + "：AP出来てます！**\n";
                  }else{
                    text += music + "：AP出来ていません！\n";
                  }
                }
              });
            }

            message.reply(text);

          }
        });

      }

    // helpコマンド 235botの機能一覧を教える。
    }else if(command === "help"){
      message.reply("");

    // birthdayコマンド 毎月の誕生日祝い企画文章を作成
    }else if(command === "birthday"){
      // 月が指定されてなかったら警告を促す
      if((data.length < 3) || (data.length > 3)){
        message.reply("birthdayコマンドを使う場合、birthdayの後にオンライン飲み会を開催したい月、日、時間 （半角数字のみ、曜日は不要） の3つを入力してください。\n**※半角スペースで区切るのを忘れずに！！**\n\n(例) 235birthday 8 15 21");
      }else{
        // 半角かつint型に変換
        let month = Number(def.hankakuToZenkaku(data[0]));

        const dayArray = ["日曜日", "月曜日", "火曜日", "水曜日", "木曜日", "金曜日", "土曜日"];

        // 指定された日の曜日を取得
        let now      = new Date();
        let year     = now.getFullYear();
        let eventDay = new Date(year, month - 1, Number(data[1]));
        let dayIndex = eventDay.getDay();

        let text = "@everyone\n日々のプロデュース業お疲れ様です！！！　" + month + "月に誕生日を迎える方々をご紹介します！！！\n" + month + "月に誕生日を迎えるのは～......\n\n";

        for(let member of birthday.data){
          if(member.month === month){
            text += "**" + member.date + "日..." + member.name + "さん**\n";
          }
        }

        text += "\nです！！！はっぴばーす！と、いうわけで" + month + "月期ラウンジオンライン飲み会のご案内でぇす！！！\n\n**開催日：" + month + "月" + data[1] + "日 （" + dayArray[dayIndex] + "）**\n**時間：" + data[2] + "時ごろ～眠くなるまで**\n**場所：ラウンジDiscord雑談通話**\n**持参品：**:shaved_ice::icecream::ice_cream::cup_with_straw::champagne_glass::pizza::cookie:\n\n遅刻OK早上がりOK、お酒やジュースを飲みながらおしゃべりを楽しむ月一の定例飲み会です！\n皆さんお気軽にご参加お待ちしてま～～～～す(o・∇・o)";

        message.channel.send(text);
      }
    }
  }
});

client.on("ready", function() {
  // それ以外の処理機能
  {
    const chat_place              = "1016885428911095920";
    const server_for_235            = {year: 2020, month: 12, date: 26};
    const cinderella_girls          = {year: 2015, month: 9, date: 3};
    const shiny_colors              = {year: 2018, month: 4, date: 24};
    const side_m                    = {year: 2014, month: 2, date: 28};
    const million_live_theater_days = {year: 2017, month: 6, date: 29};
    const idol_master               = {year: 2005, month: 7, date: 26};
    let today_birthday              = [];
    let today_birthday_people       = 0;

    setInterval(function(){
      // 日付設定
      let today       = new Date();
      let today_year  = today.getFullYear();
      let today_month = today.getMonth() + 1;
      let today_date  = today.getDate();
      let today_day   = today.getDay();
      let today_hour  = today.getHours();
      let today_min   = today.getMinutes();

      // 特定のチャンネルにメッセージを送信する時のやり方↓
      // client.channels.cache.get(chat_place).send("Hello, world!");

      // 9時にメンバーの誕生日を祝い、12時にミリシタ、235プロラウンジの周年祝い
      if((today_hour === 9) && (today_min === 0)){

        for(let member of birthday.data){
          if((today_month === member.month) && (today_date === member.date)){
            today_birthday.push(member.name);
          }
        }

        // 誕生日が1人いた時と複数人いた時
        if(today_birthday.length === 1){
  
          client.channels.cache.get(chat_place).send("本日" + today_month + "月" + today_date + "日は**" + today_birthday[0] + "さん**のお誕生日です！！\n" + today_birthday[0] + "さん、お誕生日おめでとうございます♪");
  
        }else if(today_birthday.length > 1){
  
          let birthday_timer = setInterval(function(){
            if(today_birthday_people === today_birthday.length){
              clearInterval(birthday_timer);
            }else if(today_birthday_people === 0){
  
              client.channels.cache.get(chat_place).send("本日" + today_month + "月" + today_date + "日は**" + today_birthday[today_birthday_people] + "さん**のお誕生日です！！\n" + today_birthday[today_birthday_people] + "さん、お誕生日おめでとうございます♪");
  
              today_birthday_people++;
  
            }else{
  
              client.channels.cache.get(chat_place).send("さらに！！　本日は**" + today_birthday[today_birthday_people] + "さん**のお誕生日でもあります！！\n" + today_birthday[today_birthday_people] + "さん、お誕生日おめでとうございます♪");
  
              today_birthday_people++;
  
            }
          }, 4_000)  // 4秒ごと
        }
  
      }else if((today_hour === 12) && (today_min === 0)){
        if((today_month === side_m.month) && (today_date === side_m.date)){

          client.channels.cache.get(chat_place).send("本日" + today_month + "月" + today_date + "日で**『アイドルマスター SideM』**は**" + Number(today_year - side_m.year) + "周年**を迎えます！！\nHappy Birthday♪　アイマス最高！！！");

        }else if((today_month === shiny_colors.month) && (today_date === shiny_colors.date)){

          client.channels.cache.get(chat_place).send("本日" + today_month + "月" + today_date + "日で**『アイドルマスター シャイニーカラーズ』**は**" + Number(today_year - shiny_colors.year) + "周年**を迎えます！！\nHappy Birthday♪　アイマス最高！！！");

        }else if((today_month === million_live_theater_days.month) && (today_date === million_live_theater_days.date)){

          client.channels.cache.get(chat_place).send("本日" + today_month + "月" + today_date + "日で**『アイドルマスター ミリオンライブ！ シアターデイズ』**は**" + Number(today_year - million_live_theater_days.year) + "周年**を迎えます！！\nHappy Birthday♪　アイマス最高！！！");

        }else if((today_month === idol_master.month) && (today_date === idol_master.date)){

          client.channels.cache.get(chat_place).send("本日" + today_month + "月" + today_date + "日で**『アイドルマスター』**は**" + Number(today_year - idol_master.year) + "周年**を迎えます！！\nHappy Birthday♪　アイマス最高！！！");

        }else if((today_month === cinderella_girls.month) && (today_date === cinderella_girls.date)){

          client.channels.cache.get(chat_place).send("本日" + today_month + "月" + today_date + "日で**『アイドルマスター シンデレラガールズ スターライトステージ』**は**" + Number(today_year - cinderella_girls.year) + "周年**を迎えます！！\nHappy Birthday♪　アイマス最高！！！");

        }else if((today_month === server_for_235.month) && (today_date === server_for_235.date)){

          client.channels.cache.get(chat_place).send("本日" + today_month + "月" + today_date + "日で**235プロダクション**が設立されて**" + Number(today_year - server_for_235.year) + "年**が経ちました！！\nHappy Birthday♪　これからも235プロがずっと続きますように♪");

        }
      }
    }, 60_000);  // 1分ごと
  }
});

client.login(token.BOT_TOKEN);
