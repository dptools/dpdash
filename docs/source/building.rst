Building a DPdash image
=======================
.. note:: 
   If you intend to build DPdash on an operating system other than Linux, 
   head over to the `Vagrant section <#vagrant>`_.

This guide will show you how to build a DPdash image from the ground up.

Building
--------
First, clone the DPdash repository and change into the ``singularity`` directory ::

    git clone https://github.com/harvard-nrg/dpdash.git
    cd dpdash/singularity

Now, run the ``singularity build`` command. This requires ``sudo`` privilege ::

    sudo /usr/local/bin/singularity build dpdash.sif Singularity

.. attention::
   While DPdash on GitHub is under development, you may be prompted for your 
   GitHub username and password during this build process.

Starting and stopping
---------------------
Once you have your ``dpdash.sif`` image, you'll want to head over to the 
`quick start guide <quick_start.html>`_ to learn how to initialize, start, 
and stop DPdash.

Vagrant 
-------
Building DPdash as a `Singularity <https://sylabs.io/singularity/>`_ container 
requires Linux. `Vagrant <https://www.vagrantup.com>`_ offers a fast and 
reproducible way to stand up a Linux virtual machine. If you take this route, 
you can use the following ``Vagrantfile`` to install Singularity on CentOS and 
forward port ``8000`` ::

    Vagrant.configure("2") do |config|
      config.vm.network "forwarded_port", guest: 8000, host: 8000
      config.vm.box = "bento/centos-7.6"
      config.vm.provider "virtualbox" do |vb|
         vb.memory = "1024"
      end
      config.vm.provision "shell", inline: <<-SHELL
        yum -y install libgpgme11-devel libseccomp-devel pkgconfig \
               openssl-devel libuuid-devel gcc git patch vim autoconf \
               automake libtool squashfs-tools
        cd /tmp
        if [ ! -f '/usr/local/bin/singularity' ]; then
          # install go
          export VERSION=1.12 OS=linux ARCH=amd64
          wget -q https://dl.google.com/go/go$VERSION.$OS-$ARCH.tar.gz
          sudo tar -C /usr/local -xzf go$VERSION.$OS-$ARCH.tar.gz
          rm go$VERSION.$OS-$ARCH.tar.gz
          echo 'export PATH=/usr/local/go/bin:$PATH' >> ~/.bashrc
          source ~/.bashrc
          # install singularity
          export VERSION=3.3.0
          wget -q https://github.com/sylabs/singularity/releases/download/v${VERSION}/singularity-${VERSION}.tar.gz
          tar -xzf singularity-${VERSION}.tar.gz
          cd singularity
          ./mconfig
          make -C builddir
          sudo make -C builddir install
        fi
      SHELL
    end

vagrant proxy-conf
~~~~~~~~~~~~~~~~~~
If you're going to build this Vagrant box behind a web proxy, you're going to 
need the ``vagrant-proxyconf`` plugin ::

    vagrant plugin install vagrant-proxyconf

and you will have to add the following ``config.proxy`` directives to the 
``Vagrantfile`` ::

    config.proxy.http = "..."
    config.proxy.https = "..."

cookies
~~~~~~~
For good reason, `Express.js <https://expressjs.com>`_ will **not** send cookies over 
unencrypted HTTP. If you're just kicking the tires on DPdash and you don't care about 
sending cookies over HTTP, you must change the cookie security policy within the DPdash 
configuration file ::

    config.session.cookie.secure = false;

