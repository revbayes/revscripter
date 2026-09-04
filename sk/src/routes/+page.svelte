<h2>
    RevScripter: An Introductory Tool for Creating RevBayes Analysis Scripts
</h2><br>

<p>RevScripter is a web-based tool that enables researchers to create scripts describing phylogenetic models and analyses in the Rev language. These script files then can be executed in the program <a href="https://revbayes.github.io">RevBayes</a>. RevBayes is a statistical inference tool for Bayesian phylogenetics.</p>
<p>RevBayes is extremely flexible and the Rev language and graphical model framework enable researchers to apply a very rich set of complex evolutionary models. The development of RevScripter was motivated by a need to provide a familiar introductory interface for RevBayes and the Rev language. It will not be possible to maintain a menu-driven graphical user interface that encompasses the wide range of models and methods available in RevBayes. Thus, this tool will be useful for those new to RevBayes to set up standard analyses and easily see how elements of the model are reflected in the generated Rev language script. </p>
<p>Currently, the options available in RevScripter are limited and the tool is still very much in development. The tool can create scripts for running an unrooted analysis using nucleotide data under standard substitution models. For more details about the available models and analyses, please see the README file in the <a href="https://github.com/revbayes/revscripter">RevScripter source repository</a>.</p>

<h3>
    How to use RevScripter
</h3>

<p>RevScripter is set up to guide you through the options that must be specified in the script. Start with the <i>Data</i> tab or click the <i>Get Started</i> button below. Complete your model specification and MCMC options. When you have specified a complete analysis, go to the <i>Scripts</i> tab and generate the Rev script. You will then be able to download the script as a text file or copy it to a file that you have saved locally. With a completed analysis script for RevBayes, you can run the file on your own computer (or HPC resources).</p>
<p>To run the generated script in RevBayes, be sure that the file names and paths in the generated script are correct. Then open RevBayes and type the command: <tt>source("myscript.Rev")</tt>, where <tt>myscript.Rev</tt> is the name of the file you downloaded from RevScripter.</p>

<h3>
    Source
</h3>

<p>The source code (Javascript) for RevScripter is hosted on GitHub at <a href="https://github.com/revbayes/revscripter">https://github.com/revbayes/revscripter</a></p>

<a href="/data" class="btn-style">
  Get Started
</a>