const puppeteer = require("puppeteer");
const cheerio = require("cheerio");
const fs = require("fs");

const PAGE_URL =
  "https://www.hansimmo.be/woning-te-koop-in-antwerpen/11014";
  
async function custom_trim(str){
	str = str.replace(/\s+/g, ' ');
	str = str.replace(/^\s*|\s*$/g, '');
	return str
}


const main = async () => {
	const browser = await puppeteer.launch({headless: false});
	const page = await browser.newPage();

	await page.goto(PAGE_URL);
	
	//using cheerio
	// const studie_content = await page.content();
	// $ = cheerio.load(studie_content, {normalizeWhitespace: true,decodeEntities: true});
	// description = await custom_trim($('[id="description"]').text().trim())
	// title = await custom_trim($('[property="og:title"]').attr('content'))
	// price = await custom_trim($('#detail-description-container .price').text().trim())
	// address = await custom_trim($('#detail-description-container .address').text().trim())
    // items= {
      // description: description,
      // title: title,
      // price: price,
      // address: address,
    // };
	
	
	// //using page.$eval
	// description = await custom_trim(await page.$eval('[id="description"]', text => text.textContent));
	// title = await custom_trim(await page.$eval('[property="og:title"]', title1 => title1.content));
	// price = await custom_trim(await page.$eval('#detail-description-container .price', text => text.textContent));
	// address = await custom_trim(await page.$eval('#detail-description-container .address', text => text.textContent));
	// items= {
      // description: description,
      // title: title,
      // price: price,
      // address: address,
    // };
	
	
	//querySelectors
	items = await page.evaluate(() => {
		const title = (document.querySelector('[property="og:title"]').getAttribute('content')).replace(/^\s*|\s*$/g, '');
		const description = (document.querySelector('[id="description"]').innerText).replace(/\s+/g, ' ').replace(/^\s*|\s*$/g, '');
		const price = (document.querySelector('#detail-description-container .price').innerText).replace(/^\s*|\s*$/g, '');;
		const address = (document.querySelector('#detail-description-container .address').innerText).replace(/^\s*|\s*$/g, '');;
		return {
		  description: description,
		  title: title,
		  price: price,
		  address: address,
		};
  });
  // console.log(items);
  fs.writeFileSync('output.json', JSON.stringify(items));
  return items;
};

main().then((data) => 
	console.log(data)
);