namespace UTN.Combate
{
	public class Soldado
	{
		public string Nombre {get; set; }

		public bool EstaVivo {get; set; }

		public Soldado()
		{
			EstaVivo=True; 
		}

		public void Disparar(Soldado enemigo)
		{
			enemigo.EstaVivo = False;
		}
	}
}

SoldadoTest

public class SoldadoTest 
{
	[Fact]

	public void DebeCrearUnSoldado()
	{
		var soldado = new Soldado();
		soldado.Nombre = "Juan";
		Asser.Equal("Juan", soldado.Nombre);
	}


	[Fact]

	public void DebeDisparaAUnSoldadosYElEnemigoEstarVivoFalse()
	{
		var soldado = new Soldado();
		var soldado = new Soldado();

		soldado.Disparar(enemigo);


		Assert.False(enemigo.EstaVivo);
	}

}