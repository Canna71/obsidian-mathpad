# Mathpad funciont

Mathpad is heavily based on [Nerdamer](https://nerdamer.com/) so further documentation could be inferred from its own web site. For simplicity in this doc we will use the *inline code* usage, but the same goes for the sidebar tool. Just remember that in the sidebar inputs you don't have to append the "=?" prefix. 
Note that some function could return different result depending on the "evaluation" flags (the symbolic/numeric bunnon in the sidebar or the `==?` vs `=~?` postfic): in the example it is reported explicitely in order to force evaluation in some cases. Sometimes, for clarity, only the result is displayed.

## Trigonometry
Trigonometric functions works in radians and will try to return known values when possible. 
Available funcions: 

| function | meaning               | example          | result                                                                                                                 |
|----------|-----------------------|------------------|------------------------------------------------------------------------------------------------------------------------|
| `cos`    | cosine                | `cos(pi)=?`      | $\mathrm{cos}\left(\pi\right) = -1$                                                                                    |
| `sin`    | sine                  | `sin(1/2)=~?`    | $\mathrm{sin}\left(1/2\right)=0.47942553860420299549$                                                                |
| `tan`    | tangent               | `tan(2pi)=?`     | $\mathrm{tan}\left(2*\pi\right)=0$                                                                                   |
| `sec`    | secant                | `diff(sec(x))=?` | $\frac{d}{d x}\left({\mathrm{sec}\left(x\right)}\right)=\mathrm{sec}\left(x\right) \cdot \mathrm{tan}\left(x\right)$ |
| `csc`    | cosecant              | `csc(pi/2)=?`    | $\mathrm{csc}\left(\pi/2\right)=1$                                                                                   |
| `cot`    | cotangent             | `cot(pi/4)==?`   | $\mathrm{cot}\left(\pi/4\right)=1$                                                                                   |
| `acos`   | arccosine             | `acos(-1)=~?`    | $\mathrm{acos}\left(-1\right)=3.14159265358979316028$                                                                |
| `asin`   | arcsine               | `asin(0)=~?`     | $\mathrm{asin}\left(0\right)=0$                                                                                      |
| `atan`   | arctangent            | `atan(-1)==?`    | $\mathrm{atan}\left(-1\right)=-\frac{\pi}{4}$                                                                        |
| `atan2`  | 2-argument arctangent | `atan2(1,2)=~?`  | $\mathrm{atan2}\left(1,2\right)=0.46364760900080610964$                                                              |
| `acsc`   | arccosecant           | `acsc(1)=~?`     | $\mathrm{acsc}\left(1\right)=1.57079632679489658014$                                                                 |
| `acot`   | arccotangent          | `acot(1)=~?`     | $\mathrm{acot}\left(1\right)=0.78539816339744838635$                                                                 |
| `asec`   | arcsecant             | `asec(1)==?`     | $\mathrm{asec}\left(1\right)=0$                                                                                      |

also available are the following hyberbolic functions:

`cosh`,`sinh`,`tanh`,`sech`,`csch`,`coth`,`acosh`,`asinh`,`atanh`,`asech`,`acsch` and `acoth`

## Matrix and Vector

Definine a matrix:

`M:=matrix([a,b],[b,-a])`

$$\begin{vmatrix}a & b \cr b & -a\end{vmatrix}$$

`a+M=?`

$$\begin{vmatrix}2 \cdot a & a+b \cr a+b & 0\end{vmatrix}$$

Transpose a matrix: 

`transpose(M)=?`

$$\begin{vmatrix}a & b \cr b & -a\end{vmatrix}$$

Identity Matrix of given rank:

`imatrix(3)=?`

$$\begin{vmatrix}1 & 0 & 0 \cr 0 & 1 & 0 \cr 0 & 0 & 1\end{vmatrix}$$

Extracts a column (returning a vector). Note: it's 0-based

`matgetcol(M, 1)=?`

$$\begin{vmatrix}b \cr -a\end{vmatrix}$$

Extracts a row (returning a vector). Note: it's 0-based

`matgetrow(M,1)=?`

$$\begin{vmatrix}b & -a\end{vmatrix}$$

Determinant

`determinant(matrix([8,7],[2,7]))=?`

$$42$$

