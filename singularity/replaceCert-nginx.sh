#!/bin/bash
## usage: sudo ./replaceCert-nginx.sh yourNewSiteName

## Remove last line and include dpdash conf
sed -i '$ d' /etc/nginx/nginx.conf
echo '    include /etc/nginx/conf.d/*.conf;' >> /etc/nginx/nginx.conf
echo '}' >> /etc/nginx/nginx.conf

sed -i 's:test2.neuroinfo.org:'${1}':' /etc/nginx/conf.d/dpdash.conf
