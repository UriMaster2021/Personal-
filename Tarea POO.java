enum Categoria { DEPORTES, SOCIALES, POLICIALES, ESPECTACULOS, ECONOMIA, POLITICA, TECNOLOGIA }

class Noticia {
  private long id;
  private String titulo;
  private Categoria categoria;
  private Contenido cuerpo;
  private LocalDateTime fechaPublicacion;
  // getters
  int contarPalabras() { return cuerpo.contarPalabras(); }
  boolean contienePalabra(String w) { return cuerpo.contienePalabra(w); }
  boolean contieneTodas(Collection<String> ws) { return cuerpo.contieneTodas(ws); }
}

abstract class Contenido {
  abstract int contarPalabras();
  abstract boolean contienePalabra(String w);
  boolean contieneTodas(Collection<String> ws) {
    return ws.stream().allMatch(this::contienePalabra);
  }
}

class Texto extends Contenido {
  private String texto;
  // implementar contando y buscando en texto normalizado
  int contarPalabras() { /* ... */ return 0; }
  boolean contienePalabra(String w) { /* ... */ return false; }
}

class Imagen extends Contenido {
  private String url, alt;
  int contarPalabras() { return 0; }
  boolean contienePalabra(String w) { /* buscar en alt */ return false; }
}

class Video extends Contenido {
  private String url, titulo, descripcion;
  int contarPalabras() { /* palabras de titulo+descripcion */ return 0; }
  boolean contienePalabra(String w) { /* idem */ return false; }
}

class ContenidoCompuesto extends Contenido {
  private List<Contenido> partes = new ArrayList<>();
  int contarPalabras() { return partes.stream().mapToInt(Contenido::contarPalabras).sum(); }
  boolean contienePalabra(String w) { return partes.stream().anyMatch(p -> p.contienePalabra(w)); }
}

@FunctionalInterface
interface SpecNoticia {
  boolean cumple(Noticia n);
  default SpecNoticia and(SpecNoticia other) { return n -> this.cumple(n) && other.cumple(n); }
  default SpecNoticia or(SpecNoticia other) { return n -> this.cumple(n) || other.cumple(n); }
  default SpecNoticia not() { return n -> !this.cumple(n); }
  static SpecNoticia TRUE = n -> true;
}

class TituloIgual implements SpecNoticia { /* ... */ }
class CategoriaIgual implements SpecNoticia { /* ... */ }
class CuerpoContiene implements SpecNoticia { /* ... */ }
class CuerpoContieneTodas implements SpecNoticia { /* ... */ }
class MaxPalabras implements SpecNoticia { /* ... */ }

class Usuario {
  private long id; private String email; private SpecNoticia preferencia;
  void recibir(Noticia n) { /* enviar/registrar */ }
}

class Suscripcion {
  private Usuario usuario; private SpecNoticia filtro;
  boolean aplica(Noticia n) { return filtro.cumple(n); }
  void notificar(Noticia n) { usuario.recibir(n); }
}

class ServidorNoticias {
  private List<Noticia> noticias = new ArrayList<>();
  private List<Suscripcion> suscripciones = new ArrayList<>();
  void publicar(Noticia n) {
    noticias.add(n);
    suscripciones.stream().filter(s -> s.aplica(n)).forEach(s -> s.notificar(n));
  }
  List<Noticia> buscar(SpecNoticia spec) {
    return noticias.stream().filter(spec::cumple).toList();
  }
  void suscribir(Usuario u, SpecNoticia f) { suscripciones.add(new Suscripcion(u, f)); }
}
