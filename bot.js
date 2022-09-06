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
  // botからのメッセージは無視
  if(message.author.bot) return;

  // コマンドメッセージ以外は無視
  if(!message.content.startsWith(prefix)) return;

  const msg     = message.content.slice(prefix.length);  // 235の文字だけ削除
  const data    = msg.split(" ");                        // コマンド以外の文字があったらそれを配列で取得
  const command = data.shift().toLowerCase();            // コマンド内容を小文字で取得

  // apコマンド処理
  if(command === "ap"){
    // apコマンドのみの場合apしてきた曲を一覧表示、曲名が含まれてたらその曲がapされてるか返す。
    if(data.length === 0){
      message.reply("AP曲数：13\nAP曲一覧\n『真夏のダイヤ』\n");
    }else{
      message.reply("はAP済みです！");
    }

  // helpコマンド 235botの機能一覧を教える。
  }else if(command === "help"){
    message.reply("");

  // birthdayコマンド 毎月の誕生日祝い企画文章を作成
  }else if(command === "birthday"){
    // 月が指定されてなかったら警告を促す
    if((data.length < 3) || (data.length > 3)){
      message.reply("birthdayコマンドを使う場合、birthdayの後に半角スペース、今月の月、オンライン飲み会を開催したい日(月・曜日は不要)、時間を指定してください。\n\n(例) 235birthday 8 15 21");
    }else{
      // 半角かつint型に変換
      let month = Number(def.hankakuToZenkaku(data[0]));

      const dayArray = ["日曜日", "月曜日", "火曜日", "水曜日", "木曜日", "金曜日", "土曜日"];

      // 指定された日の曜日を取得
      let now      = new Date();
      let year     = now.getFullYear();
      let eventDay = new Date(year, month - 1, Number(data[1]));
      let dayIndex = eventDay.getDay();

      let text = "日々のプロデュース業お疲れ様です！！！　" + month + "月に誕生日を迎える方々をご紹介します！！！\n" + month + "月に誕生日を迎えるのは～......\n\n";

      for(let member of birthday.data){
        if(member.month === month){
          text += "**" + member.date + "日..." + member.name + "さん**\n";
        }
      }

      text += "\nです！！！はっぴばーす！と、いうわけで" + month + "月期ラウンジオンライン飲み会のご案内でぇす！！！\n\n**開催日：" + month + "月" + data[1] + "日 （" + dayArray[dayIndex] + "）**\n**時間：" + data[2] + "時ごろ～眠くなるまで**\n**場所：ラウンジDiscord雑談通話**\n**持参品：**:shaved_ice::icecream::ice_cream::cup_with_straw::champagne_glass::pizza::cookie:\n\n遅刻OK早上がりOK、お酒やジュースを飲みながらおしゃべりを楽しむ月一の定例飲み会です！\n皆さんお気軽にご参加お待ちしてま～～～～す(o・∇・o)";

      message.channel.send(text);
    }
  }
});

client.login(token.BOT_TOKEN);
