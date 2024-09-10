#!/usr/bin/env node
'use strict';

const c = require('chalk');
const link = require('terminal-link');
const img = require('terminal-image');
const got = require('got');
const ww = require('word-wrap');
const iq = require('inquirer');
const opn = require('open');

got('https://avatars3.githubusercontent.com/u/21113261?s=600&v=4', { responseType: 'buffer' })
    .then(function (image) {
        return img.buffer(image.body, { width: '33%' });
    })
    .then(function (image) {
        console.log(image);
        console.log(
            ww(
                `
Hello, this is ${c.blue.bold('Özgür ÖZALP')}!

I'm a passionate ${c.bgRed.white.bold('software developer')} living in ${c.bold('Istanbul, Turkey')}.
I love ${c.underline.bold.green('open source development')} and I build things on my GitHub profile ${link(
                    c.red.bold('github.com/ozgurozalp'),
                    'https://github.com/ozgurozalp'
                )}.
I love ${c.bold.yellow('JavaScript')} and ${c.bold.red('PHP')}.

`.trim(),
                { width: 200, trim: true }
            )
        );

        console.log('\n\n');
        iq.prompt([
            {
                type: 'list',
                message: 'Do you want to learn more about me?',
                name: 'open',
                choices: [
                    {
                        name: c.gray(`💻  What am I doing about Open Source? (${c.bold('GitHub')})`),
                        value: 'https://github.com/ozgurozalp',
                    },
                    {
                        name: c.cyan(`🐦  What do I think? (${c.bold('Twitter')})`),
                        value: 'https://x.com/ozqurozalp',
                    },
                    {
                        name: c.blue(`🏹  Curriculum vitae, the path of my life (${c.bold('LinkedIn')})`),
                        value: 'https://linkedin.com/in/ozgurozalp',
                    },
                    { name: c.red('👋  Nope. Bye.\n'), value: false },
                ],
            },
        ])
            .then(function (a) {
                opn(a.open);
                process.exit();
            })
            .catch(function () {});
    })
    .catch(function (e) {
        console.log(e);
    });
