from lightning import Lightning
from sklearn import datasets
from numpy import corrcoef

lgn = Lightning()

mat = random.rand(10,10)
mat[mat < 0.1] = 0
group = (random.rand(10) * 5).astype('int')

lgn.adjacency(mat, group=group)