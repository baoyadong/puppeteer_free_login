'use strict';
const express = require('express');
const cookieParser = require('cookie-parser');
const cheerio = require('cheerio')
const { getHost } = require('./utils')
const app = express();

const puppeteer = require('puppeteer');

// 预发地址
const url = 'https://baidu.com'


app.use(cookieParser());

app.get('/getUnreadCount', async (req, res) => {
  const sid = req.cookies && req.cookies['s-sid']
  if (!sid) { 
    res.end('0')
    return
  }

  const cookie1 = {
    'url': url,
    'name': 's-sid',
    domain: getHost(url),
    'value': sid,
    expires: 253402271999000,
    httpOnly: true,
    secure: true,
  }

  try {
    const unreadAmount = await getPageCount(cookie1)
    res.end(unreadAmount);
  } catch(err) {
    res.end('0');
  }
});

async function getPageCount (cookie1) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setCookie(cookie1)
  await page.goto(url, { waitUntil: 'load' });
  const content = await page.content();
  const $ = cheerio.load(content);
  const amount = $('.totalCount').attr('data-id'); // 获取到未读数
  await browser.close();
  return amount || '0'
}

app.listen(8080);
