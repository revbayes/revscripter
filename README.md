# RevScripter

## Description

RevScripter is a web-based graphical tool for creating scripts in the Rev language, which then can be executed in [RevBayes](https://revbayes.github.io). 

To use RevScripter on the web, go to:
[https://revbayes.github.io/revscripter/](https://revbayes.github.io/revscripter/)

## Motivation

RevBayes is extremely flexible and the Rev language and graphical model framework enable researchers to apply a very rich set of complex evolutionary models. The development of RevScripter was motivated by a need to provide a familiar introductory interface for RevBayes and the Rev language. It will not be possible to maintain a menu-driven graphical user interface that encompasses the wide range of models and methods available in RevBayes. Thus, this tool will be useful for those new to RevBayes to set up standard analyses and easily see how elements of the model are reflected in the generated Rev language script. 

## Available Analyses

Currently, the options available in RevScripter are limited and the tool is still very much in development. Below are the current types of analyses that are possible in RevScripter:

- Data types & substitution models:
	- DNA analysis under JC, F81, K80, HKY, GTR
	- morphological analysis under Mk (coming soon!)
	- amino acid analysis under standard models (coming soon!)
- Among-site rate heterogeneity:
	- proportion of invariant sites
	- gamma-distributed rates
- Tree models:
	- unrooted trees
		- topology model: with or without outgroups assuming a uniform distribution on tree topologies
		- branch lengths: iid branch lengths under standard parametric distributions
		- clade constraints: (coming soon!)
	- rooted trees & divergence time analysis (coming soon!)
- MCMC options
	- MCMC simulation for approximating the posterior distribution
	- marginal-likelihood approximation (coming soon!)

## Developers

The development of RevScripter is led by [Lorenzo Chavarria](https://github.com/LorenzoCh11), with contributions from June Walker, Tracy Heath, and Sebastian Höhna.

## Design

The design of RevScripter is very much inspired by the BEAUti tool in the BEAST[1,2] package and the graphical user interface for the program BPP[3].

## Graphical Interface for Complex Models

While RevScripter is intended for use on the web and only to build scripts for standard phylogenetic analyses, a much more complex and rich graphical user interface is currently in development. Please stay tuned for the release of the official RevBayes GIU. This work is led by John Huelsenbeck. 

### References

[1] BEAST 1: [http://beast.community](http://beast.community)

[2] BEAST 2: [http://www.beast2.org](http://www.beast2.org)

[3] BPPg: [http://www.rannala.org/software/](http://www.rannala.org/software/)

## License

RevScripter is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.
