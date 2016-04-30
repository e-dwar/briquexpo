#!/bin/bash

echo > css/big.css
echo > css/small.css
echo > css/common.css

files=(main about hook infos slideshow team)

for f in ${files[@]} ; do
    echo -e "\n\n/* ${f}.css */\n" >> css/big.css
    cat css/big/${f}.css >> css/big.css
    echo -e "\n\n/* ${f}.css */\n" >> css/small.css
    cat css/small/${f}.css >> css/small.css
    echo -e "\n\n/* ${f}.css */\n" >> css/common.css
    cat css/common/${f}.css >> css/common.css
done
