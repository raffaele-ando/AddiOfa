"""Layout 48 · storie/reel verticali (prima fila: 8 tessere) -- elementi 48.001 e 48.002."""
from lib import *
import tiles48 as T

XS = [(11, 186, T.t1, "storia-1-ofa-di-inglese-puo-bloccarti"), (205, 181, T.t2, "storia-2-scopri-se-sei-a-rischio"),
      (393, 178, T.t3, "storia-3-82-percento"), (579, 181, T.t4, "storia-4-stessi-studenti"),
      (767, 177, T.t5, "storia-5-tre-consigli"), (951, 183, T.t6, "storia-6-small-steps"),
      (1141, 186, T.t7, "storia-7-errori-comuni"), (1335, 191, T.t8, "storia-8-quiz-completato")]


def main():
    t = nuova(1536, 440, "storie-verticali", "#FFFFFF")
    for x, w, fn, nome in XS:
        cid = clip_rett(t, 0, 0, w, 424, 12)
        with t.gruppo(nome, trasforma=f"translate({x} 9)", clip=cid):
            fn(t, w, 424)
    p = salva(t, "48-social-copertine-video", "01-storie-verticali")
    o = ritaglio(S48, (0, 0, 1536, 440), "48_r1")
    tavola(p, o, "48-01-storie-verticali")


if __name__ == "__main__":
    main()
