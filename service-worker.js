/**
 * Copyright 2016 Google Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
*/

// DO NOT EDIT THIS GENERATED OUTPUT DIRECTLY!
// This file should be overwritten as part of your build process.
// If you need to extend the behavior of the generated service worker, the best approach is to write
// additional code and include it using the importScripts option:
//   https://github.com/GoogleChrome/sw-precache#importscripts-arraystring
//
// Alternatively, it's possible to make changes to the underlying template file and then use that as the
// new base for generating output, via the templateFilePath option:
//   https://github.com/GoogleChrome/sw-precache#templatefilepath-string
//
// If you go that route, make sure that whenever you update your sw-precache dependency, you reconcile any
// changes made to this original template file with your modified copy.

// This generated service worker JavaScript will precache your site's resources.
// The code needs to be saved in a .js file at the top-level of your site, and registered
// from your pages in order to be used. See
// https://github.com/googlechrome/sw-precache/blob/master/demo/app/js/service-worker-registration.js
// for an example of how you can register this script and handle various service worker events.

/* eslint-env worker, serviceworker */
/* eslint-disable indent, no-unused-vars, no-multiple-empty-lines, max-nested-callbacks, space-before-function-paren, quotes, comma-spacing */
'use strict';

var precacheConfig = [["about/index.html","c0371820ba47a75fb9fe153c7a7899e0"],["archives/2021/06/index.html","2ccea7c36698671adfcc5eb43164c9a1"],["archives/2021/06/page/10/index.html","6156df21a5337921307391be62e5e8e7"],["archives/2021/06/page/11/index.html","052e291fb85e97ca5646a3f32fb1ac9c"],["archives/2021/06/page/12/index.html","02005e0800eff35cc4d848caad894091"],["archives/2021/06/page/13/index.html","d25bfa2e248251a907c6c3839e248268"],["archives/2021/06/page/14/index.html","95be807cd7b7f7060f5fe366db563c5f"],["archives/2021/06/page/15/index.html","0ab9c8c03fb5c478952894968f5577c4"],["archives/2021/06/page/16/index.html","fa6545ee2f689f6976b031faecf6f94c"],["archives/2021/06/page/17/index.html","04ca57732f1684ec843956672c61fd77"],["archives/2021/06/page/2/index.html","b3917e85264f9ea77ec9b0b010358886"],["archives/2021/06/page/3/index.html","8df63d39d58923dc0a7e4b1910f5dd09"],["archives/2021/06/page/4/index.html","95a7108a7f37755f38d93967b453e702"],["archives/2021/06/page/5/index.html","f934c1c6d544b4f343da1ed4ff6cd846"],["archives/2021/06/page/6/index.html","88aa9c6c09845fd66b6881ad15d6f411"],["archives/2021/06/page/7/index.html","e414dfd44cfe23b38b239da26d817ffe"],["archives/2021/06/page/8/index.html","7485cae9316924eee167192028750a74"],["archives/2021/06/page/9/index.html","2813ef28d7d287e02c73ffb876f9e586"],["archives/2021/index.html","16d43d7bd360726ec486fdf813426223"],["archives/2021/page/10/index.html","ecc68b0e75cedcd31bb1ce66e3b01f12"],["archives/2021/page/11/index.html","d3be55c89b0b60df485f0cb5e3c23313"],["archives/2021/page/12/index.html","5a3b53d4393cda1221158aa4e4bea3a0"],["archives/2021/page/13/index.html","fe69cc6703dff9d5a04dd83acb06d6ee"],["archives/2021/page/14/index.html","31a2aeeefcd7bb5cc28e16f17b145e1b"],["archives/2021/page/15/index.html","1ea6bda0af82214eec45b3bd57ac976e"],["archives/2021/page/16/index.html","61739a76de5da24f3e4cf38e69e0c1ac"],["archives/2021/page/17/index.html","5fac453eb72a046a9f726fb8729b3fdc"],["archives/2021/page/2/index.html","fff3c8c01ae830aaddface94ab46ac1a"],["archives/2021/page/3/index.html","bc4c986a6470503aa91dad02b7dab266"],["archives/2021/page/4/index.html","93839fba3bc885bedc2d594b0aa8ab28"],["archives/2021/page/5/index.html","e6879fec456fb82bfb69723d1614771d"],["archives/2021/page/6/index.html","4377d79e2626cf4ef7758a1670e088d5"],["archives/2021/page/7/index.html","0b25d1d0c37c8a24cfa6bec496aa4238"],["archives/2021/page/8/index.html","765fbe680a2e84f5777eb7a6b428de25"],["archives/2021/page/9/index.html","e693600c0a31da2df1d01c325f13a988"],["archives/index.html","ab20234664fdceb20fa50585ac78777d"],["archives/page/10/index.html","d22bfe028643a92c865f9eebdab54db0"],["archives/page/11/index.html","135ffeb9eef3b2d92853b5de5384283b"],["archives/page/12/index.html","02547850dda01b04c5026be96b42f565"],["archives/page/13/index.html","3401a7df53fdb8a6ef80228c5ba5c1e7"],["archives/page/14/index.html","f8a10f8e3b2840180e7b71d5bc3b268e"],["archives/page/15/index.html","747b6a59204699b93d1e9e8ad255f1aa"],["archives/page/16/index.html","75a3d73cbe0a34792ad21d3fb2329a74"],["archives/page/17/index.html","adb6542874b4bcf849df22acef841a9b"],["archives/page/2/index.html","6c0122cba10c792a7f4b9472aef57e7e"],["archives/page/3/index.html","4b69924a6589bf6f2f5d1a8bab176c8b"],["archives/page/4/index.html","53d590cc5009490e2d2600cc08829521"],["archives/page/5/index.html","d9b044a91cf969721898f4d31802bc22"],["archives/page/6/index.html","0d5d469c40bcaacfb68149bd1b863057"],["archives/page/7/index.html","dfba2913b065bc06d1953c87a9f78088"],["archives/page/8/index.html","7c4eb4d2c34432a5fd0879bb2a6662bf"],["archives/page/9/index.html","c616597633c4eeaef4e1c0e5641d3925"],["books/index.html","0c2e141c47b3aa21142179070cf4d199"],["categories/index.html","6c683b5e45ac9e654de1d3dbad6f9db5"],["categories/外文翻译/index.html","4b0b9f73516a18f68d0de07e76dbd163"],["categories/外文翻译/page/2/index.html","3da125ac8b453691c190802c79b3cb05"],["categories/外文翻译/page/3/index.html","f23676dde1f33609e7b728560ceb955e"],["categories/外文翻译/page/4/index.html","a9f8e0ef7bedf9722e55943aec0606e1"],["categories/外文翻译/page/5/index.html","dd73e66c8080a2c760cb264b12811320"],["categories/学习笔记/index.html","c84d31fe8075948e1b8785ea16c1a382"],["categories/学习笔记/page/2/index.html","3b294e80da2e74937887a66e473e4e59"],["categories/实战教学/index.html","92f6f88c495b5b02e79cb94fba8a532f"],["categories/实战教学/page/2/index.html","840d702326d71a228e8e79db7c626088"],["categories/实战教学/page/3/index.html","c98f88d382eed56cf1d8fbadfbe20d66"],["categories/实战教学/page/4/index.html","e79d72b0602f98064f94f72a1490742a"],["categories/技术科普/index.html","969daec391cacc0021fb3c03561911db"],["categories/技术科普/page/2/index.html","38136e41f7161d96aea71e24292eac07"],["categories/技术科普/page/3/index.html","40b904c500886eff2743068ab6fa1e52"],["categories/来都来了/index.html","27c55edd228f232e0b0216e47f7e7d18"],["categories/来都来了/page/2/index.html","4afa45a7c07862c362fa0e0ab078ba55"],["categories/来都来了/page/3/index.html","c95b98db3ebcbf4c5bb7eabda762a30b"],["categories/来都来了/page/4/index.html","5d8ce17af8fe289530fe1a8932e9cf4e"],["categories/每周一问/index.html","df05ac83760dcfbce16db43460eea5d5"],["categories/读书笔记/index.html","9abc70c798d7e9b9c02f8d60a592229d"],["categories/面试学习/index.html","1d1d0be24dd7f515d741a658dfdf84b0"],["css/index.css","c7c8ece4439a82dcac39d35b9a154252"],["css/var.css","d41d8cd98f00b204e9800998ecf8427e"],["img/404.jpg","4ef3cfb882b6dd4128da4c8745e9a507"],["img/algolia.svg","88450dd56ea1a00ba772424b30b7d34d"],["img/favicon.png","7a8c47cb5a2149c1a1af21e90ecd9ca7"],["img/friend_404.gif","68af0be9d22722e74665ef44dd532ba8"],["img/icp.png","6e26aed5ced63bc60524cc736611d39e"],["img/loading.gif","d1cf8d9ccb6a2b3514a7d14332035a3c"],["index.html","3b21d50bc1e08f7b92aee48377fdf3c7"],["js/main.js","1c7d6eb8f8b1a9e2a06c37906146eb84"],["js/search/algolia.js","e6a9c3f8fa43a7d3421169ea96eef44e"],["js/search/local-search.js","86e7fcbc5aa273e6c3d2c94b0054809b"],["js/tw_cn.js","bd869d5fd54e2fe1f1eeee7c46fa46bc"],["js/utils.js","5720a78dca20fab16f21914ae3ac0757"],["link/index.html","b86ddca60045947f21574c40e6d5c6ef"],["movies/index.html","7879dd042304ea22104df1bad8a7f5ae"],["p/0.html","2a196b7c8bd6f1386cfa12bb0f196803"],["p/102.html","a96fb5575eb5969dc82972427c54adc4"],["p/1109.html","e10e836b8fe8af9b6aa7fbc354ff2631"],["p/1229.html","2c74b3afea78ed3dbc1cc7f5667ad575"],["p/1282.html","c07af41b107731e627a05abf06b1376d"],["p/16e3.html","77bbeca47f793b61ddef4f7054547538"],["p/18ed.html","f8b7b1271c2222b2d6fe1bd45f271436"],["p/1acc.html","afaac912ac50ad02613e408ac7f1e7a9"],["p/1b55.html","f1cabff4a1f4090066724da398fb87b0"],["p/1daa.html","5afe34df796b216c20bcf1910d182bef"],["p/1f44.html","8c69c49c4c4e26c1f55f70d984e91440"],["p/23f6.html","475d2bfa6caf28603965165a9dd5905a"],["p/257a.html","73a24fff82d2de38f3cd0991d061e833"],["p/27e7.html","890f476cf9672eea3d771743ab5e6de8"],["p/28be.html","b29fcd47d3b7ead70d546e3a7c4281b7"],["p/293a.html","4e1e9959e900a64490791258cd4e9ca6"],["p/2c7f.html","01d8d757a80212f0f751050c342fdfb2"],["p/2d8c.html","e32dd28e5614851547f15a3455ab3d9a"],["p/2f4d.html","dcc7b129c170c662bf0e35ee7b18dd6b"],["p/31dd.html","0d331420710a89bb7fedab6cbc91cd6a"],["p/332b.html","757e62b3d6bb5ebb4c72bf052d6e8c4b"],["p/33d6.html","7786399bf9d8227b2410c8517e7cb840"],["p/3422.html","b23a5dd39448df845c190169cb2df01e"],["p/349f.html","0ba0b0ee26a82118f234e7cedad038f3"],["p/354f.html","75a702d09eddb966b4e768bb06ce2945"],["p/373c.html","3073dcd2b147d6d09ab7ff313f0da0a7"],["p/3bd2.html","2f3ca5ce9bb83135fb96592781abdb27"],["p/3d71.html","d0d8813752795417899b600a9b0f298c"],["p/3e02.html","61d61422da06cd59aed15fcfd690f22f"],["p/3f5e.html","bc2dd7080b72ab42f59f60b7606cc443"],["p/431c.html","3cf82a749416526500cfbdddd1a9e567"],["p/43d8.html","28825c1c6d686d0902916ac8884ac022"],["p/440f.html","a621e18462763618194d57abada0acdf"],["p/4670.html","89f4e6fcedb629c03f5557abbc8f7602"],["p/4728.html","f37d5bc4baeca83c6792045427549891"],["p/4a31.html","1d276085c6d8397000110f4611d270b0"],["p/4a8e.html","546830cf747d4ee538b3689604056d17"],["p/4ab8.html","90a30a499361b87e010c7ab6ceb14a8c"],["p/4c3a.html","d46bfc5ca9f4295448dd3f3631ccdb17"],["p/4c8f.html","136ed50cfa0f0e21536374fb8dbc4d22"],["p/4d94.html","9fbab803cfd96d69751ca70f47de0c8b"],["p/4e00.html","3d7b23d6473e8755ee0a1af5e6be0a7e"],["p/4efb.html","1fd0097a5c045b0acdec545e1d181402"],["p/4fa2.html","1bb4abeb272888ebe69023391f4a1a25"],["p/5219.html","2245d5bb74ab52c782eb1d5038790562"],["p/5c5e.html","dc65ec8dfa9bb9daf765bfe4336f430f"],["p/5daa.html","4b5597210d9d386d14a7055d424d1bf8"],["p/5de1.html","2a2186cb6d9655cfe033b5666968750f"],["p/5ed4.html","21b2c670d7bab4f79afdf22189937d83"],["p/6136.html","a87dd820ac74e1eaeaea0869db78dd4c"],["p/62cf.html","d310a8da7b40a8bc6f0a18cfeea5164c"],["p/6511.html","9833c38a3999fd0983e44f437465b4e9"],["p/66c6.html","4dc6c1132c2b9ffaf4a5b6735318904f"],["p/6804.html","ba92677d00555e77203bec2e497cd0af"],["p/6bb.html","bdd2df2b5c4b63cdaf7b13c1b5d59737"],["p/6ff8.html","01d70f07e57e8ded303cfe026f7fdadc"],["p/74e.html","a2c28b6947829e8a9fb76ad89ff498d8"],["p/76d2.html","fdc90354c5e4f014edcbbe105465c7e2"],["p/7819.html","8feb6a3b841e0ab10c098454e190a964"],["p/7839.html","b1af7ff83649bc57688df9cb1a9db518"],["p/797f.html","e2ea24522c77c858d2bf02a4003f37c9"],["p/7980.html","51fc86bde3a47258224cda868ddd1222"],["p/7b87.html","e525b5b5074f0a7ca35b030ce639921c"],["p/7c99.html","1dc56450bbf89913e60fbafcafb3eae7"],["p/7d13.html","5723d8ab2b6e6bb7e66039ac97b07f21"],["p/80ee.html","1c3f8f10caa62921703c8de076c1abc4"],["p/8245.html","27a30fb5e6d4f4f96b726544b1854622"],["p/82ca.html","1834ec7892795b733d310d30048f2136"],["p/8486.html","fe989689300c766250ff6780226b8f97"],["p/84ea.html","6eb9dbaa81652982323b89c2ea841d7b"],["p/87a1.html","4ae9e11db6316f670b35862658a3a28a"],["p/88b6.html","0a800f97ce13ffcba49cf508bc0e5705"],["p/8915.html","5781a31d98a23690553aeff72808c671"],["p/89a3.html","d2ab85375e0f3939a871b729f102c78c"],["p/8e8e.html","3e66fe182cc0939c38238aa01acac70a"],["p/91d7.html","9f92a1bf938528074c91adaf656adbb9"],["p/9234.html","2a2d105f1cb8b4956daf5e626b70bfca"],["p/94b4.html","acfc422bec6f41382ed98b1507055c47"],["p/96c9.html","c6e9f83fee59fa9f8b7a69413ea01019"],["p/96d2.html","8ca41e6fb615fbc2f46fef1e7d69da37"],["p/9793.html","845e0e022ef59d7f528724437fef9041"],["p/98b8.html","5aebcd41996e537d11519d77185edfc8"],["p/9bcc.html","8e5bfd37df1faddfdad07312e28c5373"],["p/9bdc.html","571cb843859505cca874560d88e35e83"],["p/9f29.html","dd221a074f17c379287826167afabeda"],["p/9f8a.html","9ad0c5790ac0dc3929c45a98f5ac2f07"],["p/9fa7.html","154f9e3818315350129eef16ca365edc"],["p/9fb0.html","5ab7cd0d4afe3998b87033e76c52401b"],["p/a1a7.html","fdc3561abb192f6229a131a190f252ba"],["p/a28d.html","70958677af62cb50a2b3e0fa6473662c"],["p/a56b.html","c0d56bcc5bac8392adcd43c76fc7726c"],["p/a695.html","332966af02518fab19bf9ea92712d495"],["p/a824.html","19951a822a956c2d82697f49152d4562"],["p/a92c.html","7f19c157dfc9550f4f451ef6cbdfea94"],["p/a973.html","8529365e62c3534ffdbb9df0b43e9f84"],["p/aa30.html","a8a56fbbf027f69d947b403cc9224ff2"],["p/aaa8.html","61bdc5dab69159758759eabe56d024fe"],["p/ab06.html","1eb689a7d6e34b66605e34afdc6569b6"],["p/aca.html","2de2726c05a7b8e491d329637d068778"],["p/adf2.html","9586b39f4a0b6177c7f06a008cb6e6b8"],["p/af09.html","da84663ac35a876d81d71f67c72978b7"],["p/af33.html","ced9a9afbe8970753e30b299b6453ece"],["p/afc.html","108659dcf59d61329a9724d99463c648"],["p/afc8.html","c6a4b89e31018e65b52efba1241f7b0e"],["p/b013.html","159772a639657b62898ed1869cd91150"],["p/b2bf.html","3acab4469ae750a752fb630eff207a0c"],["p/b392.html","04fcea100caff5a37320d8c803a6865a"],["p/b3ec.html","de7bffbf546134db00540b094b44682a"],["p/b66d.html","aa2a4041df07f87946f17ed9dd371c0b"],["p/ba89.html","a9409c15516dc774657a038c3aafbc6e"],["p/bc8a.html","5469e8410218bba59a7efc5e60bef6c1"],["p/bd3d.html","99bace634edcd25fe4d5a71752446c24"],["p/c0e2.html","c0f8cac807adb0b0bf9d32f736dd68a7"],["p/c226.html","4ca8698b31de754bfe42c4e5298c4049"],["p/c346.html","1df38e6d7000cfe89c4c2fafd76a56a2"],["p/c8ed.html","ec98040d41b345b2f0d61f98281381ed"],["p/ca50.html","6fe94340c5c041df84f50c381e2829c6"],["p/cb44.html","69f19ba8b1f2d9a85962aaddecf8f910"],["p/cbb1.html","6c9fa6522c0293af273e748d85a8712c"],["p/cd72.html","01f21b21fff25cddfecfc3ff0dcf4996"],["p/cf73.html","76ddfeb15b38298ae2669a8e3f40f3c8"],["p/d04f.html","e94ab45ef08d70534346d7cc56e938a3"],["p/d340.html","6a459fffda56b0ae7bd40faaf8c165ae"],["p/d412.html","8edb1346b476139c04fb3105699173a7"],["p/d67.html","af2e71a5ca42adb95ad3cb9edb1808b8"],["p/d74b.html","793272df5a3ae3130402b8cf7565919d"],["p/d81e.html","154073c10e684472b414e43f5c7c48e8"],["p/d8d0.html","cc461400b3e5b5f2133642de320fee5f"],["p/dbb1.html","6e4f7968469b2d9d34c10d242043528d"],["p/dbd2.html","fcdfe36ed78638a99ea03a54bb00b386"],["p/dfc1.html","66e0c85d18abf4c135f8f601e5468aa0"],["p/dff4.html","9ac96a17d5c569dab1a9efd86b44e5b8"],["p/e01e.html","cebc99d29ca9542d864c9090c61a09d7"],["p/e0a1.html","3ba0b0a03e77a1b4172d24e75bc6e689"],["p/e0c9.html","d36385b5367baf86f5932f044825de0a"],["p/e25d.html","f54db1bdd7efd6f3675d949d1f30bad6"],["p/e32c.html","5ee0120b67a55643fb7addf94876d85b"],["p/e376.html","651decd7a4217541fcb4215461b6a3e5"],["p/e593.html","345ceddca666e5d4168185c718470ee1"],["p/e64d.html","782b6feb7b54d5153d486acaf114ab7f"],["p/e834.html","88a77bc2433a32b4a59a43bf1cfc0f23"],["p/e87f.html","9e965b364917f43511b5f96d8501ec0c"],["p/ec16.html","d1deb73ab46de7a38e3671a775a7df26"],["p/ec8b.html","000375f0ec300c2feccc28991af67aec"],["p/ed06.html","c53e8cf024955aad2b326dcd5106e001"],["p/ee77.html","ea8d5c74785949d205118c96e06b97b7"],["p/efd4.html","d58c07ccf76ab16a86c8d866553a44b4"],["p/f04a.html","54356a7cee3ee7a773c797bb97b5294f"],["p/f226.html","77680f06dc91ce5841ed5f2b301cc324"],["p/f25e.html","c9df2c29752518239a224f989c496f73"],["p/f2b.html","14cf5670febd3cf08ad1b28c64c3e638"],["p/f370.html","2775e67419e3b92b6bb7f7e32d4caab1"],["p/f449.html","ec8d9d50d9bdb3a6d942bb7036b7d3e1"],["p/f473.html","f3ecdd5e9b6a053c133e2bb07e35f05f"],["p/f628.html","7a5387cca3dbb6adaa3a5ded4b0c5f28"],["p/f791.html","2b8d04f88f3cc0535e41b132477f8024"],["p/f82d.html","c0679b66f7477d9d730e1557c2a785f4"],["p/f833.html","58564a36244a7c2e9cbed7712686432f"],["p/f93c.html","325fe1211dd373e280bc2c7e6b8c041e"],["p/ff05.html","2038927045bea36a50d7e845c460531b"],["p/ffc5.html","11971379424ec28b32d078f8896ace10"],["p/ffc6.html","89ef778ad3fe40c3146a6b607326562c"],["page/10/index.html","aed30d2a50de30aa0f249cfa179bbd50"],["page/11/index.html","1f075cb64c68b7df3ec485a3e0c3afc5"],["page/12/index.html","cc5a4d34f2c228c4956e67e8baa80918"],["page/13/index.html","355c775898759c1a87886ef15f37c1c0"],["page/14/index.html","d915772f871f5534e31dfedb9fce4592"],["page/15/index.html","7158b0b66c3bd0e8ee860e3d04c8714d"],["page/16/index.html","bb6ef5e6da41b182d4e8dcea6069abae"],["page/17/index.html","c78d3c10f54995e000b2b747e19f03be"],["page/2/index.html","b9455f0dc651f1c5a287c7a60bdcc617"],["page/3/index.html","cb0eafeae60e1bcabe2070c111f59a40"],["page/4/index.html","93276b08fdfece5ce3fd18e8a6fd4a72"],["page/5/index.html","e7896c4ee89a9c4a967e079035a697a6"],["page/6/index.html","5770558798d2829e9edacf36153c630e"],["page/7/index.html","0c9b889f8229b378fd973b6674cc590c"],["page/8/index.html","7813a5a50ee08a99fb716014cfde3c83"],["page/9/index.html","c59677e10ad1dc66f3498445c9b13b85"],["tags/AI画家/index.html","50c952ca3fba3b0e01afa735f835a377"],["tags/Android/index.html","51360785ad2bb0a48b1344031485a9e2"],["tags/Effective-TensorFlow/index.html","983c4a024ad4d0a410a4848e96eeb003"],["tags/Effective-TensorFlow/page/2/index.html","6a6aa20e3096ce3199bbdd35fa736b47"],["tags/Flask/index.html","6c38cce88f98d0405a482b50d7004a4b"],["tags/Flutter/index.html","2a2353d257937a2417a4e79164880908"],["tags/Flutter/page/2/index.html","801aa0d5ea143d0db5d342168ab5ebe2"],["tags/Gateway/index.html","80fb896719bc5346d91407668e6dbb5c"],["tags/Git/index.html","5ccfca13e7b4e461452c6129547697a2"],["tags/HashMap/index.html","569bda19aa7ef21a0be8377b51283ea7"],["tags/Http/index.html","d6938be9e5321589e26497f809a52bcf"],["tags/Java/index.html","787c781d696e1d4d784223c3d233a849"],["tags/JavaScript/index.html","d12009ce1575c4fcdd177dc438b961d7"],["tags/MQTT/index.html","ba588e644e21da6021c15e44efecf9ec"],["tags/Machine-Learning/index.html","d2be57c01a9cde1818f5695f7c1db1d8"],["tags/RPC/index.html","87a8b01e26358d6ca60318b090d22291"],["tags/TensorFlow/index.html","3ddaeedb9b9b96c15d8e166d80bdf57d"],["tags/TensorFlow/page/2/index.html","cba97023ba14c7764da6cb4ddce8afce"],["tags/TensorFlow/page/3/index.html","96cea1a82d01ad9f671d69e1f40417f3"],["tags/docker/index.html","91aa0ad42939f4265d99744e68dfccc0"],["tags/hadoop/index.html","371b1da699b89245df1f53553cce3ada"],["tags/hexo/index.html","14d090cd87db9b1b5b8bb9f2fccb0bbd"],["tags/index.html","8cbef426ff902f363768fbd3baaca099"],["tags/pyenv/index.html","a9e48ab8ccaf961f0e492ddb24187496"],["tags/python/index.html","04ba4d4056d4d3d1b63045ffefd3b63d"],["tags/rocketmq/index.html","bc96a9758cc6de88afd5232ff27ee8f3"],["tags/springboot/index.html","0df104e426310a436b38168226ff3b4f"],["tags/个性化推荐/index.html","3ddb4195d55f91e140e335c858fb04e1"],["tags/二叉树/index.html","915afa15841dd80f6c5b0f82903e5f72"],["tags/云计算/index.html","baa706d650be840d84a426bdaef6d7ba"],["tags/以图搜图/index.html","8d164acaf3ec997adefd99b5810f0914"],["tags/其他/index.html","b590122ca5d7f41a35fd4f854c960ff9"],["tags/其他/page/2/index.html","d2629e83f7642ae75ace9e2142435c81"],["tags/其他/page/3/index.html","e48b33edd135956f28884e7870db1cd0"],["tags/其他/page/4/index.html","b7fad7e3547c32ead0374cce8d75fc00"],["tags/其他/page/5/index.html","f5f92d75abed7d94cd698c0b5277a1b5"],["tags/其他翻译/index.html","5a16b53403ba3cfb0402cbf464edf825"],["tags/其他翻译/page/2/index.html","fade5b4ed8805a973cdff48292f5e025"],["tags/区块链/index.html","a799fc6f077241ff75220d4a74a3f0b3"],["tags/卷积神经网络/index.html","f325040fd4f110b4ed7c5069783bbbe6"],["tags/少儿编程/index.html","5618b4a86c75ce777f7c6d396f430bcf"],["tags/并查集/index.html","a154261da9f9b8e90293a2aeec35b47b"],["tags/微服务/index.html","b8159a18635a9125954868ffdc72c0bc"],["tags/心得/index.html","f857463b3bb73635fb755fcdd4430201"],["tags/总结/index.html","66d13dca538a8ff406fdb132cb2722d5"],["tags/掘金翻译计划/index.html","ce34180cd37e64bd8c70828d19bd5c3c"],["tags/掘金翻译计划/page/2/index.html","26dc65d720542aa43492dc92d70ed0e6"],["tags/掘金翻译计划/page/3/index.html","432987438295cf2dc8b98fd95926a4de"],["tags/操作系统/index.html","3363d1a393e680c290bae144423da2f9"],["tags/数据分析/index.html","8d20c643a48d0c5e921b158a9352d2d9"],["tags/数据可视化/index.html","b795e3ad9c85a1f677c1cdfbd3c52bfb"],["tags/数据库/index.html","f24eb535dcc2a166f5ea38232663ddef"],["tags/机器学习/index.html","325652a5fd866cb3bbbdae0aa33ab096"],["tags/消息队列/index.html","2433d8eea5512b02c90e3e9850ee377a"],["tags/算法/index.html","30f87dd74462f79c994ac4057a43e0f4"],["tags/计算机组成原理/index.html","8fbb139b14198c404443f692993db774"],["tags/计算机网络/index.html","6be165d04fcd98fd6c89b8acc2c93474"],["tags/读书笔记/index.html","a3287ecb658af345a95c9d0724a04b13"],["tags/进制转换/index.html","4b376d4465219136553468a968ce8228"],["tags/面经/index.html","9c81b0d402065a78defc1bae395e19a3"]];
var cacheName = 'sw-precache-v3--' + (self.registration ? self.registration.scope : '');


var ignoreUrlParametersMatching = [/^utm_/];



var addDirectoryIndex = function(originalUrl, index) {
    var url = new URL(originalUrl);
    if (url.pathname.slice(-1) === '/') {
      url.pathname += index;
    }
    return url.toString();
  };

var cleanResponse = function(originalResponse) {
    // If this is not a redirected response, then we don't have to do anything.
    if (!originalResponse.redirected) {
      return Promise.resolve(originalResponse);
    }

    // Firefox 50 and below doesn't support the Response.body stream, so we may
    // need to read the entire body to memory as a Blob.
    var bodyPromise = 'body' in originalResponse ?
      Promise.resolve(originalResponse.body) :
      originalResponse.blob();

    return bodyPromise.then(function(body) {
      // new Response() is happy when passed either a stream or a Blob.
      return new Response(body, {
        headers: originalResponse.headers,
        status: originalResponse.status,
        statusText: originalResponse.statusText
      });
    });
  };

var createCacheKey = function(originalUrl, paramName, paramValue,
                           dontCacheBustUrlsMatching) {
    // Create a new URL object to avoid modifying originalUrl.
    var url = new URL(originalUrl);

    // If dontCacheBustUrlsMatching is not set, or if we don't have a match,
    // then add in the extra cache-busting URL parameter.
    if (!dontCacheBustUrlsMatching ||
        !(url.pathname.match(dontCacheBustUrlsMatching))) {
      url.search += (url.search ? '&' : '') +
        encodeURIComponent(paramName) + '=' + encodeURIComponent(paramValue);
    }

    return url.toString();
  };

var isPathWhitelisted = function(whitelist, absoluteUrlString) {
    // If the whitelist is empty, then consider all URLs to be whitelisted.
    if (whitelist.length === 0) {
      return true;
    }

    // Otherwise compare each path regex to the path of the URL passed in.
    var path = (new URL(absoluteUrlString)).pathname;
    return whitelist.some(function(whitelistedPathRegex) {
      return path.match(whitelistedPathRegex);
    });
  };

var stripIgnoredUrlParameters = function(originalUrl,
    ignoreUrlParametersMatching) {
    var url = new URL(originalUrl);
    // Remove the hash; see https://github.com/GoogleChrome/sw-precache/issues/290
    url.hash = '';

    url.search = url.search.slice(1) // Exclude initial '?'
      .split('&') // Split into an array of 'key=value' strings
      .map(function(kv) {
        return kv.split('='); // Split each 'key=value' string into a [key, value] array
      })
      .filter(function(kv) {
        return ignoreUrlParametersMatching.every(function(ignoredRegex) {
          return !ignoredRegex.test(kv[0]); // Return true iff the key doesn't match any of the regexes.
        });
      })
      .map(function(kv) {
        return kv.join('='); // Join each [key, value] array into a 'key=value' string
      })
      .join('&'); // Join the array of 'key=value' strings into a string with '&' in between each

    return url.toString();
  };


var hashParamName = '_sw-precache';
var urlsToCacheKeys = new Map(
  precacheConfig.map(function(item) {
    var relativeUrl = item[0];
    var hash = item[1];
    var absoluteUrl = new URL(relativeUrl, self.location);
    var cacheKey = createCacheKey(absoluteUrl, hashParamName, hash, false);
    return [absoluteUrl.toString(), cacheKey];
  })
);

function setOfCachedUrls(cache) {
  return cache.keys().then(function(requests) {
    return requests.map(function(request) {
      return request.url;
    });
  }).then(function(urls) {
    return new Set(urls);
  });
}

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(cacheName).then(function(cache) {
      return setOfCachedUrls(cache).then(function(cachedUrls) {
        return Promise.all(
          Array.from(urlsToCacheKeys.values()).map(function(cacheKey) {
            // If we don't have a key matching url in the cache already, add it.
            if (!cachedUrls.has(cacheKey)) {
              var request = new Request(cacheKey, {credentials: 'same-origin'});
              return fetch(request).then(function(response) {
                // Bail out of installation unless we get back a 200 OK for
                // every request.
                if (!response.ok) {
                  throw new Error('Request for ' + cacheKey + ' returned a ' +
                    'response with status ' + response.status);
                }

                return cleanResponse(response).then(function(responseToCache) {
                  return cache.put(cacheKey, responseToCache);
                });
              });
            }
          })
        );
      });
    }).then(function() {
      
      // Force the SW to transition from installing -> active state
      return self.skipWaiting();
      
    })
  );
});

self.addEventListener('activate', function(event) {
  var setOfExpectedUrls = new Set(urlsToCacheKeys.values());

  event.waitUntil(
    caches.open(cacheName).then(function(cache) {
      return cache.keys().then(function(existingRequests) {
        return Promise.all(
          existingRequests.map(function(existingRequest) {
            if (!setOfExpectedUrls.has(existingRequest.url)) {
              return cache.delete(existingRequest);
            }
          })
        );
      });
    }).then(function() {
      
      return self.clients.claim();
      
    })
  );
});


self.addEventListener('fetch', function(event) {
  if (event.request.method === 'GET') {
    // Should we call event.respondWith() inside this fetch event handler?
    // This needs to be determined synchronously, which will give other fetch
    // handlers a chance to handle the request if need be.
    var shouldRespond;

    // First, remove all the ignored parameters and hash fragment, and see if we
    // have that URL in our cache. If so, great! shouldRespond will be true.
    var url = stripIgnoredUrlParameters(event.request.url, ignoreUrlParametersMatching);
    shouldRespond = urlsToCacheKeys.has(url);

    // If shouldRespond is false, check again, this time with 'index.html'
    // (or whatever the directoryIndex option is set to) at the end.
    var directoryIndex = 'index.html';
    if (!shouldRespond && directoryIndex) {
      url = addDirectoryIndex(url, directoryIndex);
      shouldRespond = urlsToCacheKeys.has(url);
    }

    // If shouldRespond is still false, check to see if this is a navigation
    // request, and if so, whether the URL matches navigateFallbackWhitelist.
    var navigateFallback = '';
    if (!shouldRespond &&
        navigateFallback &&
        (event.request.mode === 'navigate') &&
        isPathWhitelisted([], event.request.url)) {
      url = new URL(navigateFallback, self.location).toString();
      shouldRespond = urlsToCacheKeys.has(url);
    }

    // If shouldRespond was set to true at any point, then call
    // event.respondWith(), using the appropriate cache key.
    if (shouldRespond) {
      event.respondWith(
        caches.open(cacheName).then(function(cache) {
          return cache.match(urlsToCacheKeys.get(url)).then(function(response) {
            if (response) {
              return response;
            }
            throw Error('The cached response that was expected is missing.');
          });
        }).catch(function(e) {
          // Fall back to just fetch()ing the request if some unexpected error
          // prevented the cached response from being valid.
          console.warn('Couldn\'t serve response for "%s" from cache: %O', event.request.url, e);
          return fetch(event.request);
        })
      );
    }
  }
});







