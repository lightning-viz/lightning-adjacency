from lightning import Lightning
from numpy import random

lgn = Lightning()

mat = random.rand(10,10)
mat[mat < 0.75] = 0
group = (random.rand(10) * 5).astype('int')

lgn.adjacency(mat, group=group)