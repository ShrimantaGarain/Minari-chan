"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var Discord = require('discord.js');
var client = new Discord.Client();
var path = require("path");
var wavConverter = require("wav-converter");
var got = require('got');
var gtts = require('node-gtts')('en');
var sdk = require("microsoft-cognitiveservices-speech-sdk");
var onCooldown = false;
var _a = require('./config.json'), token = _a.token, prefix = _a.prefix, microsoft_token = _a.microsoft_token, botname = _a.botname, ownername = _a.ownername;
var speechConfig = sdk.SpeechConfig.fromSubscription("" + microsoft_token, "eastus");
var fs = require("fs");
var stream_1 = require("stream");
var SILENCE_FRAME = Buffer.from([0xF8, 0xFF, 0xFE]);
var Silence = /** @class */ (function (_super) {
    __extends(Silence, _super);
    function Silence() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Silence.prototype._read = function () {
        this.push(SILENCE_FRAME);
        this.destroy();
    };
    return Silence;
}(stream_1.Readable));
// Only try to join the sender's voice channel if they are in one themselves
client.once('ready', function () {
    console.log('Ready!');
});
client.on('message', function (message) { return __awaiter(void 0, void 0, void 0, function () {
    var connection_1, stream, connection, dispatcher;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!(message.content === prefix + "speak" && message.member.voice.channel)) return [3 /*break*/, 2];
                return [4 /*yield*/, message.member.voice.channel.join()];
            case 1:
                connection_1 = _a.sent();
                connection_1.on('speaking', function (user, speaking) { return __awaiter(void 0, void 0, void 0, function () {
                    var voicechannel, audioStream, writer;
                    return __generator(this, function (_a) {
                        if (onCooldown) {
                            return [2 /*return*/];
                        }
                        else {
                            if (speaking) {
                                onCooldown = true;
                                setTimeout(function () {
                                    onCooldown = false;
                                }, 5000);
                                console.log("I'm listening to " + user);
                                voicechannel = message.member.voice.channel;
                                if (!voicechannel) {
                                    message.channel.send("Please join a voice channel first!");
                                    return [2 /*return*/];
                                }
                                audioStream = connection_1.receiver.createStream(message.member, {
                                    mode: "pcm",
                                    end: "silence"
                                });
                                writer = audioStream.pipe(fs.createWriteStream("./components/recordings/" + message.author.id + ".pcm"));
                                writer.on("finish", function () { return __awaiter(void 0, void 0, void 0, function () {
                                    function makewav() {
                                        return __awaiter(this, void 0, void 0, function () {
                                            var pcmData, wavData;
                                            return __generator(this, function (_a) {
                                                pcmData = fs.readFileSync(path.resolve(__dirname, "./components/recordings/" + message.author.id + ".pcm"));
                                                wavData = wavConverter.encodeWav(pcmData, {
                                                    numChannels: 2,
                                                    sampleRate: 48000,
                                                    byteRate: 174
                                                });
                                                fs.writeFileSync(path.resolve(__dirname, "./components/speaking_audio/" + message.author.id + ".wav"), wavData);
                                                return [2 /*return*/];
                                            });
                                        });
                                    }
                                    function fromFile() {
                                        return __awaiter(this, void 0, void 0, function () {
                                            var audioConfig, recognizer;
                                            var _this = this;
                                            return __generator(this, function (_a) {
                                                audioConfig = sdk.AudioConfig.fromWavFileInput(fs.readFileSync("./components/speaking_audio/" + message.author.id + ".wav"));
                                                recognizer = new sdk.SpeechRecognizer(speechConfig, audioConfig);
                                                recognizer.recognizeOnceAsync(function (result) { return __awaiter(_this, void 0, void 0, function () {
                                                    var msg;
                                                    var _this = this;
                                                    return __generator(this, function (_a) {
                                                        msg = result.text;
                                                        got("https://api.affiliateplus.xyz/api/chatbot?message=" + encodeURIComponent(msg) + "&botname=" + botname + "&ownername=" + ownername).then(function (response) { return __awaiter(_this, void 0, void 0, function () {
                                                            var content, audio_save_path;
                                                            return __generator(this, function (_a) {
                                                                content = JSON.parse(response.body);
                                                                audio_save_path = path.join(__dirname, "./components/speaking_audio/" + message.author.id + ".wav");
                                                                gtts.save(audio_save_path, content.message, function () {
                                                                    return __awaiter(this, void 0, void 0, function () {
                                                                        var dispatcher;
                                                                        return __generator(this, function (_a) {
                                                                            dispatcher = connection_1.play("./components/speaking_audio/" + message.author.id + ".wav");
                                                                            dispatcher.on('start', function () {
                                                                                console.log('now playing!');
                                                                            }).on('finish', function () {
                                                                                console.log('finished playing!');
                                                                            }).on('error', console.error);
                                                                            return [2 /*return*/];
                                                                        });
                                                                    });
                                                                });
                                                                return [2 /*return*/];
                                                            });
                                                        }); })["catch"](function (err) {
                                                            console.log(err);
                                                        });
                                                        recognizer.close();
                                                        return [2 /*return*/];
                                                    });
                                                }); });
                                                return [2 /*return*/];
                                            });
                                        });
                                    }
                                    return __generator(this, function (_a) {
                                        switch (_a.label) {
                                            case 0:
                                                ;
                                                return [4 /*yield*/, makewav()];
                                            case 1:
                                                _a.sent();
                                                fromFile();
                                                /*      await message.channel.send("Processing audio.....", {         //to use the below method of send the audio file to discord first and then to the servie api --> use this piece of code
                                                        files: [
                                                          `./components/speaking_audio/${message.author.id}.wav`
                                                     
                                                     
                                                        ]
                                                      })
                                                 
                                                     
                                                      .then(msg => {
                                                      console.log(msg.attachments.array()[0])
                                                               }).catch(console.error);             // if you use another api to get text from speech you can send the audio to discord as attachment and take the url from this and send it to the api for processing
                                                               
                                                      */
                                                return [4 /*yield*/, message.channel.send("Sending response.....")];
                                            case 2:
                                                /*      await message.channel.send("Processing audio.....", {         //to use the below method of send the audio file to discord first and then to the servie api --> use this piece of code
                                                        files: [
                                                          `./components/speaking_audio/${message.author.id}.wav`
                                                     
                                                     
                                                        ]
                                                      })
                                                 
                                                     
                                                      .then(msg => {
                                                      console.log(msg.attachments.array()[0])
                                                               }).catch(console.error);             // if you use another api to get text from speech you can send the audio to discord as attachment and take the url from this and send it to the api for processing
                                                               
                                                      */
                                                _a.sent();
                                                return [2 /*return*/];
                                        }
                                    });
                                }); });
                                connection_1.play(new Silence(), { type: 'opus' });
                            }
                        }
                        return [2 /*return*/];
                    });
                }); });
                _a.label = 2;
            case 2:
                if (!(message.content === "play")) return [3 /*break*/, 4];
                stream = fs.createReadStream("./components/recordings/" + message.author.id + ".pcm");
                return [4 /*yield*/, message.member.voice.channel.join()];
            case 3:
                connection = _a.sent();
                dispatcher = connection.play(stream, {
                    type: "converted"
                });
                dispatcher.on("finish", function () {
                    //    message.member.voice.channel.leave();
                    return message.channel.send("finished playing audio");
                });
                _a.label = 4;
            case 4: return [2 /*return*/];
        }
    });
}); });
client.login(token);
