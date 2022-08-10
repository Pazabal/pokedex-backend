const configDB = require('../knexfile');
const knex = require('knex')(configDB.development);

const getAllPokemons = () => {
    return knex 
    .column('id' , 'name' , 'weight','height' ,'description', 'image', 'hp', 'atk', 'def', 'satk','sdef', 'spd')
    .select()
    .from('pokemon')
}

knex.select('*')
    .from('pokemon')
    .join('moves', {'moves.id': 'pokemon.moves_id'})
    .join('types', {'types.id': 'pokemon.types_id'})
    .join('pokemonsxmoves', {'pokemonsxmoves.id': 'pokemon.pokemonsxmoves_id'})
    .join('pokemonsxtypes', {'pokemonsxtypes.id': 'pokemon.pokemonsxtypes_id'})



const getPokemonById = (id) => {
    return knex('pokemon')
    .where('id',id)
    .select('name', 'id', 'weight','height' ,'description', 'image', 'hp', 'atk', 'def', 'satk','sdef', 'spd')
}

const createPokemon = (body) => {
    knex('pokemon')
    .insert(body)
    .returning('id')
    .then( (id) => {
        const pokemonsToInsertMoves = body.moves.map(move =>
            ({moves_id: move.id, pokemon_id: id}));
    
         return knex('pokemonsxmoves').insert(pokemonsToInsertMoves)
            // console.log("create pokemon");

    })
    .then( (id) =>{
        const pokemonsToInsertType = body.types.map(type =>
            ({types_id: type.id, pokemon_id: id}))
        return knex('pokemonsxtypes').insert(pokemonsToInsertType)
    })
    .catch((error) => {res.send('Error' + error)})
    
   
}

const updatePokemon = (id, body) => {
    return knex('pokemon')
    .where('id', id)
    .update(body)
}

const deletePokemon = (id) =>{
    return knex('pokemon')
    .where('id' , id)
    .del()
}

module.exports = {
    getAllPokemons,
    getPokemonById,
    createPokemon,
    updatePokemon,
    deletePokemon

}