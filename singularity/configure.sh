#!/bin/bash

# strict mode so script quits immediately upon failure
set -eo pipefail

sudo /sbin/sysctl -p /etc/sysctl.conf
sudo /sbin/sysctl -w fs.file-max=100000
sudo /sbin/sysctl --system

sudo bash -c "cat >> /etc/security/limits.conf <<- 'EOF'
* soft     nproc          100000
* hard     nproc          100000
* soft     nofile          100000
* hard     nofile          100000
root soft     nproc          100000
root hard     nproc          100000
root soft     nofile          100000
root hard     nofile          100000
EOF"
