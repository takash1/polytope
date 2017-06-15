const GR = (Math.sqrt(5) + 1) / 2;
var ws = 140;       // whole size
var t = 1;          // state 600(t=1),rectified600(t=2),rect120(t=3),120(t=4)

var nvert = array2d(120, 4);  // vertices
var nhd = array2d(120, 12);   // neighborhood

var edge0 = array2d(720, 2);
var edge1 = array2d(3600, 2);
var edge2 = array2d(3600, 2);
var edge3 = array2d(1200, 2);
var tedge = [edge0, edge1, edge2, edge3];
var tenum = array2d(4, 4);    //{0, b, b+r, b+r+y}for each dimension

var pvert = array2d(120, 3);
var vert0 = array2d(720, 3);
var vert1 = array2d(3600, 3);
var vert2 = array2d(3600, 3);
var vert3 = array2d(1200, 3);
var tvert = [vert0, vert1, vert2, vert3];


function setupArray() {
  let aper = [
    [0, 1, 2, 3], [0, 3, 1, 2], [0, 2, 3, 1], [3, 1, 0, 2],
    [2, 1, 3, 0], [2, 3, 0, 1], [1, 0, 3, 2], [3, 0, 2, 1],
    [2, 0, 1, 3], [1, 3, 2, 0], [1, 2, 0, 3], [3, 2, 1, 0]
  ];


  // set vertices
  for (let i = 0; i < 16; i++) {
    let l = i;
    for (let j = 0; j < 4; j++) {
      nvert[i][j] = 2 * (l % 2) - 1;
      l = Math.floor(l / 2);
    }
  }

  for (let i = 0; i < 8; i++) {
    nvert[i+16][0] = 4 * nvert[i][0];
    nvert[i+16][1] = 3 * nvert[i][1];
    nvert[i+16][2] = 1 * nvert[i][2];
  }

  for (let i = 1; i < 12; i++) {
    for (let j = 0; j < 8; j++) {
      for (let k = 0; k < 4; k++) {
        nvert[8 * i + j + 16][k] = nvert[j+16][aper[i][k]];
      }
    }
  }

  for (let i = 0; i < 4; i++) {
    nvert[2 * i + 112][i] = 2;
    nvert[2 * i + 113][i] = -2;
  }

  for (let i = 0; i < 120; i++) {
    for (let j = 0; j < 3; j++) {
      pvert[i][j] = gval(nvert[i][j])[0] + GR * gval(nvert[i][j])[1];
    }
  }


  // set neighbor
  for (let i = 0; i < 120; i++) {
    let k = 0;
    for (let j = 0; j < 120; j++) {
      if (isedge(i, j) == 1) {
        nhd[i][k] = j;
        k++;
      }
    }
  }


  // set edge
  let m = 0;
  for (let i = 1; i < 4; i++) {
    for (let j = 0; j < 120; j++) {
      for (let k = 0; k < 12; k++) {
        if (j < nhd[j][k] && projcol(j, nhd[j][k]) == i) {
          tedge[0][m][0] = j;
          tedge[0][m][1] = nhd[j][k];
          for (let l = 0; l < 5; l++) {
            tedge[1][5 * m + l] = tedge[0][m];
            tedge[2][5 * m + l] = tedge[0][m];
          }
          m++;
        }
      }
    }
    tenum[0][i] = m;
    tenum[1][i] = 5 * m;
    tenum[2][i] = 5 * m;
  }


  let ar = new Array(5);
  for (let i = 0; i < tenum[0][3]; i++) {
    ar = cap(tedge[0][i][0], tedge[0][i][1], 5);
    for (let j = 0; j < 5; j++) {
      tvert[1][5 * i + j] = pvert[ar[j]];
    }
    let l = 0;
    for (let j = 0; j < 4; j++) {
      for (let k = j + 1; k < 5; k++) {
        if (isedge(ar[j], ar[k]) == 1) {
          for (let m = 0; m < 3; m++) {
            tvert[2][5 * i + l][m] = pvert[ar[j]][m] + pvert[ar[k]][m];
          }
          l++;
        }
      }
    }
  }

  let l = 0;
  for (let i = 1; i < 4; i++) {
    for (let j = 0; j < 119; j++) {
      for (let k = j + 1; k < 120; k++) {
        if (isedge(j, k) == 2 && projcol(j, k) == i) {
          tedge[3][l][0] = j;
          tedge[3][l][1] = k;
          for (let m = 0; m < 3; m++) {
            for (let tmp = 0; tmp < 3; tmp ++) {
              tvert[3][l][m] += pvert[cap(j, k, 3)[tmp]][m];
            }
          }
          l++
        }
      }
    }
    tenum[3][i] = l;
  }
}


function array2d(i, j) {
  let arr = new Array(i);
  for (let l = 0; l < i; l++) {
    arr[l] = Array.apply(null, Array(j)).map(function() { return 0 });
  }
  return arr;
}


function gval(num) {
  // {a,b} denotes a+b*(golden ratio)
  let val = [
    [0, -1], [1, -1], [-2, 0], [-1, 0],
    [0,  0], [1, 0], [2, 0], [-1, 1], [0, 1]
  ];
  return val[num+4];
}


function isedge(n0, n1) {
  if (gdist(nvert[n0], nvert[n1])[0] == 8 &&
      gdist(nvert[n0], nvert[n1])[1] == -4) {
    return 1;
  } else if (gdist(nvert[n0], nvert[n1])[0] == 4 &&
             gdist(nvert[n0], nvert[n1])[1] == 0) {
    return 2;
  } else {
    return 0;
  }
}


function gdist(n1, n2) {
  let m0 = n1.length;
  let m1 = array2d(m0, 2);
  let m2 = [0, 0];

  for (let i = 0; i < m0; i++) {
    for (let j = 0; j < 2; j++) {
      m1[i][j] = gval(n1[i])[j] - gval(n2[i])[j];
    }
  }

  for (let i = 0; i < m0; i++) {
    m2[0] += m1[i][0] * m1[i][0] + m1[i][1] * m1[i][1];
    m2[1] += 2 * m1[i][0] * m1[i][1] + m1[i][1] * m1[i][1];
  }
  return m2;
}


function projcol(n0, n1) {
  let m0 = new Array(3);
  let m1 = new Array(3);
  for (let i = 0; i < 3; i++) {
    m0[i] = nvert[n0][i];
    m1[i] = nvert[n1][i];
  }

  if (gdist(m0, m1)[0] == 8 || gdist(m0, m1)[0] == 4) {
    return 1;   // blue
  } else if ( gdist(m0, m1)[0] == 7 ||
             (gdist(m0, m1)[0] == 3 && gdist(m0, m1)[1] == -1) ||
              gdist(m0, m1)[0] == 2) {
    return 2;   // red
  } else if (gdist(m0, m1)[0] == 6 || gdist(m0, m1)[3] == 3) {
    return 3;   // yellow
  } else {
    return 0;
  }
}


function cap(n0, n1, m) {
  let a2 = new Array(m);
  let i = 0;
  let j = 0;
  let k = 0;
  while (k < m && i < 12 && j < 12) {
    if (nhd[n0][i] < nhd[n1][j]) {
      i++;
    } else if (nhd[n0][i] > nhd[n1][j]) {
      j++;
    } else {
      a2[k] = nhd[n0][i];
      i++;
      j++;
      k++;
    }
  }
  return a2;
}


function ends(dim, i) {
  let en = array2d(2, 3);
  for (let a = 0; a < 2; a++) {
    for (let b = 0; b < 3; b++) {
      en[a][b] = ws * (tvert[dim][i][b] / t
                       + pos(dim, t) * pvert[tedge[dim][i][a]][b]
                       + pos(dim+1, t) * pvert[tedge[dim][i][1-a]][b]);
    }
  }
  return en;
}


function pos(dim, r) {
  if (r < dim) {
    return 0;
  } else if (r <= dim + 1) {
    return 1 - dim / r;
  } else {
    return 1 / r;
  }
}
