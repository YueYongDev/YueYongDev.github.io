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

var precacheConfig = [["about/index.html","d39bf3841543796efe09aa5644014e0f"],["archives/2021/06/index.html","744861b56571e373d8953a46e8fe839b"],["archives/2021/06/page/10/index.html","594b30c146cbe64cb7462a5f11a57dee"],["archives/2021/06/page/11/index.html","e253f6942a8bb8788c85735479f20265"],["archives/2021/06/page/12/index.html","3d35f10895c318367889c56606b78e09"],["archives/2021/06/page/13/index.html","4aa563c228ec781948c365cc1dad556d"],["archives/2021/06/page/14/index.html","d13dbb3d4f479914fc26b64ba4d08ce9"],["archives/2021/06/page/15/index.html","1957f2eb501b14189cee1362e64909ce"],["archives/2021/06/page/16/index.html","88aac6f1d29f732da0b9f522e61cc0c3"],["archives/2021/06/page/17/index.html","423072b8cad1bb9017c9538081766ba2"],["archives/2021/06/page/2/index.html","b9cf8124eeeeede87d84ae43b3e4ec14"],["archives/2021/06/page/3/index.html","3ab446fe157896295a3220fb02e3ae61"],["archives/2021/06/page/4/index.html","f09b83a5e0556a5d9e661fb272a18ff2"],["archives/2021/06/page/5/index.html","3165d5c3140b99a624847202b87a6d7e"],["archives/2021/06/page/6/index.html","6a99a796faeeeeb45cdcd5fa667610ee"],["archives/2021/06/page/7/index.html","a2be18732557d5070b53fac60b68c8b5"],["archives/2021/06/page/8/index.html","f36a026170de8b89bd41ade6da67100e"],["archives/2021/06/page/9/index.html","80cd5ed5d3b0f36c895b9b15a6ba8ae4"],["archives/2021/index.html","ac1f4636aec062df6e0376850d9e7e58"],["archives/2021/page/10/index.html","132335ef3e8774cec65852f7ab28a967"],["archives/2021/page/11/index.html","e51e45019d79fce1a8ee5a612c963302"],["archives/2021/page/12/index.html","330065857e2f26db7ad786c994dd1fb6"],["archives/2021/page/13/index.html","53aea5223ed8f50f9cfa5ea89087851e"],["archives/2021/page/14/index.html","930fe6f603c9b008d1baf55758bb7c21"],["archives/2021/page/15/index.html","d322d4fb9d385c31931fb7ca0de0f13c"],["archives/2021/page/16/index.html","ddb3621cfc2a648508e3cd7f6c66a029"],["archives/2021/page/17/index.html","6021bf36c2acfabd871dbaebc037250f"],["archives/2021/page/2/index.html","2e7c84c2299e859847e54e7275018a93"],["archives/2021/page/3/index.html","5323b5c70bc2e1955c417f498dcacb2f"],["archives/2021/page/4/index.html","d10298bcd5825533abb8256210369369"],["archives/2021/page/5/index.html","1e632fecd8a5565440104bc18b05566d"],["archives/2021/page/6/index.html","767b8eb20f29e2abda322ff4b6cb9ce3"],["archives/2021/page/7/index.html","efc90121aae3cf507d27769fa9f0c254"],["archives/2021/page/8/index.html","448ea3eb5697b8afbda1b5d0c1bfa2bc"],["archives/2021/page/9/index.html","f3b1726ea37fccada234b999ae4cc4ef"],["archives/index.html","114d8b0ff67fcf0347fc6bb98496bc5d"],["archives/page/10/index.html","badc7347155b60f03690aaa4d2d5eb9c"],["archives/page/11/index.html","92c5f591d2daa09bc9321c537737bfcd"],["archives/page/12/index.html","11b630e479f89f06d767169c4d9b833b"],["archives/page/13/index.html","d357cc267b064d352e6f1d3b12024ee5"],["archives/page/14/index.html","50523a8a305a8c5ea7acbdea5c13be22"],["archives/page/15/index.html","750f1b73683d33c42d609b49c79321c3"],["archives/page/16/index.html","0c405b9a88e6e1180f1b87099aa920fd"],["archives/page/17/index.html","1786c09caf41ff52dc6d6ac453a2a35e"],["archives/page/2/index.html","a59a5202c2c97a71f8f89e5531caafd3"],["archives/page/3/index.html","f8fd9c825d6e40be25422baded9525fe"],["archives/page/4/index.html","7eadbace60a5bddb2429288cad395c75"],["archives/page/5/index.html","a070e3151b8ce8716d88211a298ef3ed"],["archives/page/6/index.html","7ace90edea02dfa2c7c7c14e69410def"],["archives/page/7/index.html","9b9bff6813c4851018783f3bd2c2a1f6"],["archives/page/8/index.html","058950bd10cf17c12648194001c09009"],["archives/page/9/index.html","e1149dee423e1f1b5b1c7b56a43290c0"],["books/index.html","c1a0dee8972039ef05b23c4fcc5d631e"],["categories/index.html","de7965511fda6cc5bd57434bafc4d9f2"],["categories/外文翻译/index.html","172db0d021e9d5f537198227938faee8"],["categories/外文翻译/page/2/index.html","568330342f5922431234f258690f4c15"],["categories/外文翻译/page/3/index.html","73c7903e952fdaa3f0f71e89ffd6966c"],["categories/外文翻译/page/4/index.html","f706186985c538a62740c15bfb7e013b"],["categories/外文翻译/page/5/index.html","c7d4ce7b78a9d5c4dfd95f571a5519e1"],["categories/学习笔记/index.html","2be17effd698bdd8c2bbfb915f1e9561"],["categories/学习笔记/page/2/index.html","35a83a27b998244114e8296f8ca514ed"],["categories/实战教学/index.html","f45200cd7192fe5fdd035022b21a8a50"],["categories/实战教学/page/2/index.html","b80025fc46a7454c1ace7bb1811ee2bc"],["categories/实战教学/page/3/index.html","8e2fb8f692d99394cbd641a25975d802"],["categories/实战教学/page/4/index.html","56ae94aa710f5c276812c0cad4872b2f"],["categories/技术科普/index.html","6c5d445a835fe16ee17346cb18750aee"],["categories/技术科普/page/2/index.html","7dd0d02b75aeb0609a321d92fd6a0d61"],["categories/技术科普/page/3/index.html","2f3f266cb8129c87a7e2b7bcef454535"],["categories/来都来了/index.html","ca13900ed18d5ae8476d93f550905908"],["categories/来都来了/page/2/index.html","b1f45f46822362c42a255ef7146b6fd1"],["categories/来都来了/page/3/index.html","9bcd27d190006eb10ff8b152e803d208"],["categories/来都来了/page/4/index.html","72d6a90b112a93a6867a7d40d2fa747e"],["categories/每周一问/index.html","a6925583d781fdef203a7f9391ea4418"],["categories/读书笔记/index.html","3537fd69cf1b011db0afa8070014d090"],["categories/面试学习/index.html","63e7db7cc9dc5728e79a2bc7d4959814"],["css/index.css","c7c8ece4439a82dcac39d35b9a154252"],["css/var.css","d41d8cd98f00b204e9800998ecf8427e"],["img/404.jpg","4ef3cfb882b6dd4128da4c8745e9a507"],["img/algolia.svg","88450dd56ea1a00ba772424b30b7d34d"],["img/favicon.png","7a8c47cb5a2149c1a1af21e90ecd9ca7"],["img/friend_404.gif","68af0be9d22722e74665ef44dd532ba8"],["img/icp.png","6e26aed5ced63bc60524cc736611d39e"],["img/loading.gif","d1cf8d9ccb6a2b3514a7d14332035a3c"],["index.html","b5f255cd9694b36f7c71ada07779e242"],["js/main.js","1c7d6eb8f8b1a9e2a06c37906146eb84"],["js/search/algolia.js","e6a9c3f8fa43a7d3421169ea96eef44e"],["js/search/local-search.js","86e7fcbc5aa273e6c3d2c94b0054809b"],["js/tw_cn.js","bd869d5fd54e2fe1f1eeee7c46fa46bc"],["js/utils.js","5720a78dca20fab16f21914ae3ac0757"],["link/index.html","b9eb35b834a5ee134e8938c408fefd0b"],["movies/index.html","3ef3909b66bafa799b3e77ed4b754ddd"],["p/0.html","2fc1c0bd683ba8280e4b8b814c490b86"],["p/102.html","959cab1f649aaa71bbf6d6d6e135d912"],["p/1109.html","15ffc64adf57141d50e7ed62cf675699"],["p/1229.html","430be99ad26747e22cb4818245b9f8ea"],["p/1282.html","568cc8cfad3653c8060d598c31a14dd9"],["p/16e3.html","29952e8efe6d6b38d56cef85b62c9c29"],["p/18ed.html","018461a0bfe9a80237d98e2d8028f0b8"],["p/1acc.html","aafc8ddf5f654dbf219ebe575cf4c930"],["p/1b55.html","f538aedc1d06b5a68127daed4f5b066f"],["p/1daa.html","0d6d7ba4a3aae35127839464ebcce230"],["p/1f44.html","f50e3f2b4f139483984b18f4f0412c9a"],["p/23f6.html","bf861bd225e9c0e08aaa5becf52fb71f"],["p/257a.html","f56c2e9426a5065e1e316260184df724"],["p/27e7.html","d9a8d3cfe30af98afa48c97063b12458"],["p/28be.html","cd2623b5fb73f87c15dad3404a5c16f1"],["p/293a.html","312dd0a49118896ebf470eb74c88a403"],["p/2c7f.html","69d0fd6869eaf3c7ad51874751bc5867"],["p/2d8c.html","eb9adb5602d5ae092c247e4c4d02abd6"],["p/2f4d.html","0638ceaca7511a2cb8893e2fb640d69c"],["p/31dd.html","3efba53d22a5973810e6f3dff697395d"],["p/332b.html","57e9076358f615b434988c57a3385f39"],["p/33d6.html","e6ad80fed019c2bea9699947285a3be2"],["p/3422.html","602f6de8fdd39454f5bad441eeeafebe"],["p/349f.html","3481e805de313e035621cda3d8ebba33"],["p/354f.html","6503ecce3df26e3bbfd438413449fa9a"],["p/373c.html","92f7a2d40be449a3d11eee781340e35d"],["p/3bd2.html","11236b1b242df060058e2a35d692f557"],["p/3d71.html","c9cb16c25a4fa99370a6ed2a1bc79aa4"],["p/3e02.html","e68bd2e141c1f96c19394e72e5c79112"],["p/3f5e.html","c947a3972f3ff4b036580475a2a91c91"],["p/431c.html","c39e136350ccea687ede16f45b286b09"],["p/43d8.html","7d09d422b89bcc2b5716ded5adff2035"],["p/440f.html","0ae48f2d5d90b47dc0f0619bd0e81728"],["p/4670.html","2f544524de732739019c0c9c7c4d1f75"],["p/4728.html","2f5eca4612ee440ff94d1f675c9b7460"],["p/4a31.html","40671ebdc679acdd6c3df14d984d1258"],["p/4a8e.html","c526020b2633ee929c63ac0f0b5a4f42"],["p/4ab8.html","e57c8a26049bcc5a5b67f9a19aab456a"],["p/4c3a.html","8f48986ae6054f15d407c5bb43409ad4"],["p/4c8f.html","dc0ab16289f84064711380e14625e903"],["p/4d94.html","e8163a9695e2dce9f115b51cdda60351"],["p/4e00.html","4075edc6b718c338c3ecd51bc29fd034"],["p/4efb.html","e52772f915c10ecc731b366be199ea4b"],["p/4fa2.html","d94a7e0818b87485b4aebd640463583c"],["p/5219.html","9cf21f411d5aa82a6432308af8f22787"],["p/5c5e.html","24cd8d027bc31d3855fef0c89e8b17c1"],["p/5daa.html","d4396d2d9b7634a5e4e23f8d8463ea40"],["p/5de1.html","0e42a7baec31d7a34cd3269095a67c9a"],["p/5ed4.html","6455184af55a8d0ee7c8e4200014f9ba"],["p/6136.html","0f2a245ec7cc71485e94fa75fde65916"],["p/62cf.html","83023a6f72cf12d60389d397e879fe60"],["p/6511.html","b8d35da490933116989a6ecb2dd075ad"],["p/66c6.html","312f8dee1880de53caace0f306e1159f"],["p/6804.html","a8804e18a79dda297621777a8c045188"],["p/6bb.html","db359b109ef3cad2e2070e61a407c879"],["p/6ff8.html","284e7c273cc23d9480b68fae4e9c1aae"],["p/74e.html","5477846afecf4f77dddec476258ae2ca"],["p/76d2.html","366c6ea67bf90ae629906a60905a4b9c"],["p/7819.html","9027a6ef4daf56ff26835f2a5d974687"],["p/7839.html","081795c7e23ca0b2bff30719a27e7466"],["p/797f.html","009c3cc681c5f618f97ee60fd39c4f35"],["p/7980.html","a8d61a142fbad5bb7ec23f8f6eca5ca8"],["p/7b87.html","bf403ef54a399ee8b880c04340afe698"],["p/7c99.html","de3496333635e0cc8979c9847857bfde"],["p/7d13.html","e0f743a03249db31fe882fd1197cd097"],["p/80ee.html","dd669b2ce2498bc4b28aa8d6c0083aed"],["p/8245.html","6938e7811c85a38698f0f26ad56164db"],["p/82ca.html","160d87da46d3f333771175a6f5b65bf7"],["p/8486.html","618e8e2e987cd62bcfbee3915fa986a3"],["p/84ea.html","11e2bb03b4818d9bad8df3db79f6eaed"],["p/87a1.html","06e55a6feed906ca6388f80b7cd99e28"],["p/88b6.html","d24145c0e55a9398ae30a5d280bf7ca2"],["p/8915.html","8831c5e23cbe9220910d8ff9cc7ab469"],["p/89a3.html","0befd8a6701537aedd457b63ce60b827"],["p/8e8e.html","5a7a076bd96a8496727a9d5fe60b3d82"],["p/91d7.html","b49d1c1bfeea3c8d78e45b5f88b0fc67"],["p/9234.html","20f0da5f2b074f483c94f25bcb26fc6e"],["p/94b4.html","c264d6de311d51baa381acde5266926f"],["p/96c9.html","c63c9ca5aa024f60fb6e34483aac7415"],["p/96d2.html","849c674f480288a2dba6aa99850f8a29"],["p/9793.html","697c67bd6ad4f0d7267e6c526b4fbd4d"],["p/98b8.html","01ea972e390c786b9edfa332efbbb6ed"],["p/9bcc.html","888fa36505b3629097fa9a27b7351696"],["p/9bdc.html","0c225d62a9840a0cdfe01edd03aa408d"],["p/9f29.html","2e7335188a257c8208414189ce78f9b4"],["p/9f8a.html","efdf8ebcc46b6c2a7964a0cffd156d36"],["p/9fa7.html","a28f3f3a3426a2d7237567a4f116e7b7"],["p/9fb0.html","dc756f0a7750667cb0885ef54d62dfed"],["p/a1a7.html","fef0c036affae6eaf23c066010789d34"],["p/a28d.html","ef508fd22f6037676e7e909e36813091"],["p/a56b.html","f6f44024e350828509853f7a68f18054"],["p/a695.html","3ac22dfff3ce1d327ce08f897944e1f8"],["p/a824.html","6f7f6b97cff8819ddc6691f6cdb41158"],["p/a92c.html","0cc811c413537b7def81177b1ee11a44"],["p/a973.html","9fe9689fa67cd540c28c9edaf619dd2f"],["p/aa30.html","3a52cc317ecdf617728b5530f8872693"],["p/aaa8.html","fcb13f8e3a411f71a361dd1216df7a72"],["p/ab06.html","738d737665d7e7d87863a1aabc441f83"],["p/aca.html","4774f75995436e3eaecdd9da1b3b2de0"],["p/adf2.html","aee5c24da755f7ba84f2deae1a84a348"],["p/af09.html","42b8ba3a0a16ba0098089acfa914a38c"],["p/af33.html","7ee552abdb69a11e36b5addc36a65710"],["p/afc.html","5f6683d2f92c6236c2d2e3fd435783b5"],["p/afc8.html","3f9c756ec950b42410dd776b9ccfadbd"],["p/b013.html","04020d3dae75a7c96e4d8ae6a6dde33f"],["p/b2bf.html","c4382f84eda350189aeb53c7f1095394"],["p/b392.html","28b86f6c3b4d4048ec8a124e5f05ca9b"],["p/b3ec.html","a03cbba9be2f0cc83006066239d0c08e"],["p/b66d.html","8fd6f8d620818ae9690d91442bf480db"],["p/ba89.html","03d90a18732c40bc0b99c5953c243fcc"],["p/bc8a.html","17d2d67a83a107020b0fca7e3c63212f"],["p/bd3d.html","a3af8fee62d0ed3001116e478912adda"],["p/c226.html","6eb382ca133b63a3af2ee4b87e28f82c"],["p/c346.html","e75ef1eda044e553e0e3a615a8561044"],["p/c8ed.html","8e4a7776ccd7e524b71ae002846717b0"],["p/ca50.html","3a6d595c6ae34363e8711a68c9c9e831"],["p/cb44.html","3dde6dff0ff7e2d523eaeb6c06e01eba"],["p/cbb1.html","2419b07ab923b190046b408679902c33"],["p/cd72.html","180361140bf1d4845aaca0072bb434fe"],["p/cf73.html","3bced933be269f0dbcd084c999df4229"],["p/d04f.html","5a9bb5e5a3bf9b3c1984b82b231793a4"],["p/d340.html","d6405bf45abc06ed6976544681c7f49e"],["p/d412.html","c65b79c57afafa93f0128169da8aaf36"],["p/d67.html","9b0b3580a0a2d3ab6b4e464cad1bfa00"],["p/d74b.html","3ab94947d30e6ab88296542e4ad42d0c"],["p/d81e.html","42db8b3fe3bf35020b964abc85d997af"],["p/d8d0.html","bcf21f9ab5071d62a4dfa309b4f16afb"],["p/dbb1.html","017fd89bbf837a474e4de63de8cc54ef"],["p/dbd2.html","2c78682202ae26c6d689ec13f7899c42"],["p/dfc1.html","929390ce48d391731680477408fe5437"],["p/dff4.html","6503eba73760614e39c0d73767d857c4"],["p/e01e.html","118f533f689860dbdb20a55e02bac504"],["p/e0a1.html","050f673eaa70d6c0d4972d43ebc74fc7"],["p/e0c9.html","7db13c9d67e8dc1818c70f4fa7c11f94"],["p/e25d.html","c77e67ddd739e70e086cd98676535ca4"],["p/e32c.html","a00edb8de7f833543def9c4f30d4fe31"],["p/e376.html","ca77d07cb385742c2fe54b563ff06d72"],["p/e593.html","6d03859627ae0c6a876f7c6a3543b93f"],["p/e64d.html","f6d3a56c5b6e7a9db20baadfa5007a2a"],["p/e834.html","cb54b70592a272126feed75a00221195"],["p/e87f.html","863488b42fa7514425e7e7b113a1f389"],["p/ec16.html","825a643b49dce20580f11c009d5ca2d6"],["p/ec8b.html","53a1c732085b87e6adc78d8f0254a76c"],["p/ed06.html","a3b1e4f96ac9c203545e78daaf8b0114"],["p/ee77.html","4f9bd836c4332127dd68b04d5b0a4c87"],["p/efd4.html","88d45f5f514c941603b454b15d9b840f"],["p/f04a.html","2ce66fd57d4d8d974c435fd90c3d2a38"],["p/f226.html","3eac3157f7538a63aae8e496812fd8a0"],["p/f25e.html","f650b6f94603d1b8f80711da4c99e50c"],["p/f2b.html","3d13940381ee460c1869efeea31d841a"],["p/f370.html","b6a5641fb047e32654ccebb0b4a4308c"],["p/f449.html","b6cf22361bd50624f24ffa68deb372ac"],["p/f473.html","eb11332c6b1df20c68ca0338442f9b6d"],["p/f628.html","eb8dae3576bcacecb24204016929bf16"],["p/f791.html","e8c86b9e5c518d054d8bf9f852129e57"],["p/f82d.html","6dead0cad011d7f9178e07a29449a960"],["p/f833.html","2eab2b93372883737dca2c4e44f3eb9a"],["p/f93c.html","cc34bf8cbcdef756e490b2e71b93a6b0"],["p/ff05.html","042f921356129cc84542cd23291c4ee4"],["p/ffc5.html","b53a55bd1b12abc1e47c7457b26aebab"],["p/ffc6.html","69bd4ee9cfa049c3374569e842fbe04a"],["page/10/index.html","d523e5184d4dbd970da93fa9107c976d"],["page/11/index.html","7fc2d9082920a5b70fa78044475c7a6c"],["page/12/index.html","f02d052658fa3e5075e94b33ae2caa82"],["page/13/index.html","b1a785f86db07061cf261d4a4ddb3a3f"],["page/14/index.html","3d8cc8f5163b082f2475e8996b1a1eb9"],["page/15/index.html","073ce4339f0518c39c6b1c751da626ea"],["page/16/index.html","319078d37aba9e4a87144bb4b70c8ea6"],["page/17/index.html","e275ae8919a8554f60aa16cc338ee7e9"],["page/2/index.html","7906fa2c3039ee1f0c57db308f740215"],["page/3/index.html","ce3a068d1efd955c4bf87dff0c637c61"],["page/4/index.html","2161a8a59844370425a315fe4f2e873b"],["page/5/index.html","be4195f046831b7c567c246ecc13fa33"],["page/6/index.html","939833aff4b407a619fbd8a6ab5682be"],["page/7/index.html","63ad85a3deaf717e25a907353ea8fb62"],["page/8/index.html","114796441f46ccd2e6aa6668cfb84db3"],["page/9/index.html","ac7578f2fa1d445c961bfa37e2831e1d"],["tags/AI画家/index.html","c7d222024235c1243216ab82016e5ef3"],["tags/Android/index.html","4cd2e0ba3c67323a758e9673319f29ac"],["tags/Effective-TensorFlow/index.html","d38e7a8b73a6074a526af3c950106154"],["tags/Effective-TensorFlow/page/2/index.html","58c24a89a75164742e8011c289cdb986"],["tags/Flask/index.html","7b34f79fc4b00cc9eefea92dc3050072"],["tags/Flutter/index.html","d5cf68c0b19bf95ed227830824c26e2a"],["tags/Flutter/page/2/index.html","9457a3503912bd3ae4c5710e348dae51"],["tags/Gateway/index.html","682c6fdeb0f76a3d8cd93b0008e1afd3"],["tags/Git/index.html","72df17838ce2015520234e139e81766a"],["tags/HashMap/index.html","7672406029a6833bfa0a8e6eb5a59b25"],["tags/Http/index.html","d8af333537983a1abdfb026f6212e790"],["tags/JavaScript/index.html","586419858c386ff8f231098e68aa38c8"],["tags/MQTT/index.html","1175be4a95a9314112b563378c8c862c"],["tags/Machine-Learning/index.html","583546a33de788b824eab5aa626eff6e"],["tags/RPC/index.html","294bc4dff672b2acc6a3ce89284f26fa"],["tags/TensorFlow/index.html","dee4c78611ac2f1c32af351bc6109d80"],["tags/TensorFlow/page/2/index.html","4b3d6e7283ee68d62c543c812415f23f"],["tags/TensorFlow/page/3/index.html","081be6b0773eddfd4837cde90cad9d26"],["tags/docker/index.html","049c893a27385b9a27d558ccf1a91284"],["tags/hadoop/index.html","71f8c183aa55efba4bf8ddf305930d46"],["tags/hexo/index.html","07107f28b6b6a0a94eb8ada08a21cae1"],["tags/index.html","9f8c1eb3fe752b53824285098512165b"],["tags/java/index.html","f72b3fb4b56a3a6944b07f1b8ad43191"],["tags/pyenv/index.html","190a40fd2b50880daae61b41ede77c9b"],["tags/python/index.html","7fbc959e9463e534cb02cb96f210f99c"],["tags/rocketmq/index.html","c16b59c125c9601a9aa6bc1b1fa10f67"],["tags/springboot/index.html","be5516aaa7c28e7220650786a889cded"],["tags/个性化推荐/index.html","9e4f6e2261af819c882b0a99cd83b454"],["tags/二叉树/index.html","c15c6c68be6815cf9d37f5d787848b5d"],["tags/云计算/index.html","4200435724f131c58947cf152a43322a"],["tags/以图搜图/index.html","b68dcfb6ce443b2a2f5f207267be284a"],["tags/其他/index.html","3284d4e2d2b670c4a6b1b655ddccacdb"],["tags/其他/page/2/index.html","6bf6804a2bdb0a58e3de187b50f5b3ff"],["tags/其他/page/3/index.html","59dc3f1452d11b0e7d6efe98ae023265"],["tags/其他/page/4/index.html","c1bbf35fafb9ecff571c928f9ca25222"],["tags/其他/page/5/index.html","ae05349a8af97a99eed676c6539d20e2"],["tags/其他翻译/index.html","21dcd766c667f2683b9aa6f506f761dd"],["tags/其他翻译/page/2/index.html","f6e7e58ee7ca4780cab15ff4bb78e21b"],["tags/区块链/index.html","047e202d8baefa994372ea9c3aea3174"],["tags/卷积神经网络/index.html","9ad0b36b2cdabcce62e8895664f60baa"],["tags/少儿编程/index.html","8cbf8f09263fc63a49e54c83ba996b10"],["tags/并查集/index.html","cc8601adf1f75109ef98788d8645f6a1"],["tags/微服务/index.html","aaab17cea26bfff00c053f34cb2e4423"],["tags/心得/index.html","6784f9d831504cf3ba505d674e13ddd5"],["tags/总结/index.html","0db437c975f70ef848799136d57bfea9"],["tags/掘金翻译计划/index.html","89d535725faabfedec995b6a2cf3dc16"],["tags/掘金翻译计划/page/2/index.html","3f1ed4e2aa054ff2c4db1b5ff9b1b3dc"],["tags/掘金翻译计划/page/3/index.html","2b8019254e0b382877bb08707800dba7"],["tags/操作系统/index.html","1c11d174d326ce120ae4412d7a8211db"],["tags/数据分析/index.html","c4a2932c447a4efc73e25bcd9f676ad1"],["tags/数据可视化/index.html","5ad5b5786356605f0ffeeeb82a808f01"],["tags/数据库/index.html","e8f657947f9f900f62420675c11e6e8a"],["tags/机器学习/index.html","fafc68eb2ebd6abb8cfac23af535ee41"],["tags/消息队列/index.html","74b41b507ad61672d71dfcc21e9be31d"],["tags/算法/index.html","3c745e88e808f6928986b785ed72ae49"],["tags/计算机组成原理/index.html","74329022da34c203f5f45b0b170c30b0"],["tags/计算机网络/index.html","e88aac2920d1b72f1465b00f2a5a14ee"],["tags/读书笔记/index.html","59171ed70963650b3f3a9bf22f0b641c"],["tags/进制转换/index.html","28b5a8b8e54528477fcb6ea0e0bf877f"],["tags/面经/index.html","6fad4fc21be4bdefc55367e581e2412c"]];
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







