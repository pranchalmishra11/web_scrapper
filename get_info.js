const puppeteer=require('puppeteer');
const xlsx=require('xlsx');
async function getPagedata(url,page){
	await page.goto(url);
	const h1=await page.$eval(".product_main h1", h1=>h1.textContent);
	const price=await page.$eval(".price_color", price=>price.textContent);
	const stock_check=await page.$eval(".instock.availability", instock=>instock.innerText);
	return{
		Name:h1,
		Price:price,
		Availability:stock_check
	}
};
async function getlinks_mystery()	//getting links of all books from Mystery genre
{
	const browser=await puppeteer.launch({headless:false});
	const page=await browser.newPage();
	await page.goto('http://books.toscrape.com/catalogue/category/books/mystery_3/index.html');
	const links=await page.$$eval('.product_pod .image_container a',allAs=>allAs.map(a=>a.href));
	await browser.close();
	return links;
}
async function getlinks_fiction()   //getting links of all books from fiction genre
{
	const browser=await puppeteer.launch({headless:false});
	const page=await browser.newPage();
	await page.goto('http://books.toscrape.com/catalogue/category/books/fiction_10/index.html');
	const links=await page.$$eval('.product_pod .image_container a',allAs=>allAs.map(a=>a.href));
	await browser.close();
	return links;
}
async function main()
{
	const all_links_mystery=await getlinks_mystery();
	const all_links_fiction=await getlinks_fiction();
	//console.log(all_links);
	const browser=await puppeteer.launch({headless:false});
	const page=await browser.newPage();
	const scrapped_data_mystery=[];
	const scrapped_data_fiction=[];
	for(let link of all_links_mystery)
	{
		const data=await getPagedata(link,page);
		scrapped_data_mystery.push(data);
	}
	for(let link of all_links_fiction)
	{
		const data=await getPagedata(link,page);
		scrapped_data_fiction.push(data);
	}
	const wb=xlsx.utils.book_new();
	const ws1=xlsx.utils.json_to_sheet(scrapped_data_mystery);
	const ws2=xlsx.utils.json_to_sheet(scrapped_data_fiction)
	xlsx.utils.book_append_sheet(wb,ws1,"Mystery genre");  // sheet-1 in workbook depicts details for book availabilty for Mystery genre
	xlsx.utils.book_append_sheet(wb,ws2,"Fiction genre");  // sheet-2 in workbook depicts details for book availabilty for Fiction genre
	xlsx.writeFile(wb,"books.xlsx");
	//console.log(scrapped_data_mystery);
	//console.log(scrapped_data_fiction);

	
}
main();